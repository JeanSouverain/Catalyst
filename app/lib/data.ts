import postgres from 'postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';

let sql: postgres.Sql | null = null;

try {
  sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
} catch (error) {
  console.warn('Database not available, using fallback data');
}

// Fallback data for development
const fallbackRevenue: Revenue[] = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 5000 },
  { month: 'Apr', revenue: 4500 },
  { month: 'May', revenue: 6000 },
  { month: 'Jun', revenue: 5500 },
  { month: 'Jul', revenue: 7000 },
  { month: 'Aug', revenue: 6500 },
  { month: 'Sep', revenue: 8000 },
  { month: 'Oct', revenue: 7500 },
  { month: 'Nov', revenue: 9000 },
  { month: 'Dec', revenue: 8500 },
];

const fallbackInvoices: InvoicesTable[] = [
  {
    id: '1',
    customer_id: '1',
    amount: 15795,
    status: 'pending',
    date: '2022-12-06',
    name: 'Evil Rabbit',
    email: 'evil@rabbit.com',
    image_url: '/customers/evil-rabbit.png',
  },
  {
    id: '2',
    customer_id: '2',
    amount: 20348,
    status: 'pending',
    date: '2022-11-14',
    name: 'Delba de Oliveira',
    email: 'delba@oliveira.com',
    image_url: '/customers/delba-de-oliveira.png',
  },
];

const fallbackCustomers: CustomersTableType[] = [
  {
    id: '1',
    name: 'Evil Rabbit',
    email: 'evil@rabbit.com',
    image_url: '/customers/evil-rabbit.png',
    total_invoices: 2,
    total_pending: 36143,
    total_paid: 0,
  },
  {
    id: '2',
    name: 'Delba de Oliveira',
    email: 'delba@oliveira.com',
    image_url: '/customers/delba-de-oliveira.png',
    total_invoices: 1,
    total_pending: 20348,
    total_paid: 0,
  },
];

export async function fetchRevenue() {
  try {
    if (!sql) throw new Error('Database not available');

    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue[]>`SELECT * FROM revenue`;

    // console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.warn('Database not available, using fallback revenue data');
    return fallbackRevenue;
  }
}

export async function fetchLatestInvoices() {
  try {
    if (!sql) throw new Error('Database not available');

    const data = await sql<LatestInvoiceRaw[]>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.warn('Database not available, using fallback latest invoices');
    return fallbackInvoices.slice(0, 5).map((invoice) => ({
      id: invoice.id,
      name: invoice.name,
      email: invoice.email,
      image_url: invoice.image_url,
      amount: formatCurrency(invoice.amount),
    }));
  }
}

export async function fetchCardData() {
  try {
    if (!sql) throw new Error('Database not available');

    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0][0].count ?? '0');
    const numberOfCustomers = Number(data[1][0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2][0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2][0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.warn('Database not available, using fallback card data');
    // Return fallback data
    return {
      numberOfCustomers: fallbackCustomers.length,
      numberOfInvoices: fallbackInvoices.length,
      totalPaidInvoices: formatCurrency(0),
      totalPendingInvoices: formatCurrency(fallbackInvoices.reduce((sum, inv) => sum + inv.amount, 0)),
    };
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable[]>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices;
  } catch (error) {
    console.warn('Database not available, using fallback invoice data');
    // Filter fallback invoices based on query
    const filteredInvoices = fallbackInvoices.filter(invoice => {
      const customer = fallbackCustomers.find(c => c.id === invoice.customer_id);
      if (!customer) return false;
      
      const searchTerm = query.toLowerCase();
      return (
        customer.name.toLowerCase().includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm) ||
        invoice.amount.toString().includes(searchTerm) ||
        invoice.date.toISOString().includes(searchTerm) ||
        invoice.status.toLowerCase().includes(searchTerm)
      );
    });

    // Paginate the filtered results
    const paginatedInvoices = filteredInvoices
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(offset, offset + ITEMS_PER_PAGE);

    // Transform to match the expected format
    return paginatedInvoices.map(invoice => {
      const customer = fallbackCustomers.find(c => c.id === invoice.customer_id)!;
      return {
        id: invoice.id,
        amount: invoice.amount,
        date: invoice.date,
        status: invoice.status,
        name: customer.name,
        email: customer.email,
        image_url: customer.image_url,
      };
    });
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.warn('Database not available, using fallback invoice data for pagination');
    // Filter fallback invoices based on query
    const filteredInvoices = fallbackInvoices.filter(invoice => {
      const customer = fallbackCustomers.find(c => c.id === invoice.customer_id);
      if (!customer) return false;
      
      const searchTerm = query.toLowerCase();
      return (
        customer.name.toLowerCase().includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm) ||
        invoice.amount.toString().includes(searchTerm) ||
        invoice.date.toISOString().includes(searchTerm) ||
        invoice.status.toLowerCase().includes(searchTerm)
      );
    });

    const totalPages = Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE);
    return totalPages;
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm[]>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.warn('Database not available, using fallback invoice data');
    // Find invoice in fallback data
    const fallbackInvoice = fallbackInvoices.find(inv => inv.id === id);
    if (!fallbackInvoice) {
      throw new Error('Invoice not found.');
    }

    return {
      id: fallbackInvoice.id,
      customer_id: fallbackInvoice.customer_id,
      amount: fallbackInvoice.amount / 100, // Convert from cents to dollars
      status: fallbackInvoice.status,
    };
  }
}

export async function fetchCustomers() {
  try {
    const customers = await sql<CustomerField[]>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    return customers;
  } catch (err) {
    console.warn('Database not available, using fallback customer data');
    return fallbackCustomers.map(customer => ({
      id: customer.id,
      name: customer.name,
    })).sort((a, b) => a.name.localeCompare(b.name));
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType[]>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.warn('Database not available, using fallback customer data');
    // Filter fallback customers based on query
    const filteredCustomers = fallbackCustomers.filter(customer => {
      const searchTerm = query.toLowerCase();
      return (
        customer.name.toLowerCase().includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm)
      );
    });

    // Calculate invoice totals for each customer
    const customersWithTotals = filteredCustomers.map(customer => {
      const customerInvoices = fallbackInvoices.filter(inv => inv.customer_id === customer.id);
      const totalInvoices = customerInvoices.length;
      const totalPending = customerInvoices
        .filter(inv => inv.status === 'pending')
        .reduce((sum, inv) => sum + inv.amount, 0);
      const totalPaid = customerInvoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.amount, 0);

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        image_url: customer.image_url,
        total_invoices: totalInvoices,
        total_pending: formatCurrency(totalPending),
        total_paid: formatCurrency(totalPaid),
      };
    });

    return customersWithTotals.sort((a, b) => a.name.localeCompare(b.name));
  }
}
