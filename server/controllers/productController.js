const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
  });
  const getProducts = async (req, res) => {
    const {
      page = 1,
      limit = 10,
      search = '',
      category,
      priceRange, 
      sort = 'latest'
    } = req.query;
  
    const skip = (page - 1) * limit;
  
    const where = {
      name: { contains: search, mode: 'insensitive' },
      ...(category && {
        category: {
          equals: category.toLowerCase(),        }
      }),
    };
    
  
    if (priceRange) {
      const [min, max] = priceRange.split('-');
      where.price = {
        gte: parseFloat(min),
        lte: parseFloat(max),
      };
    }
    const orderBy =
    sort === 'priceLow'
      ? { price: 'asc' }
      : sort === 'priceHigh'
      ? { price: 'desc' }
      : { id: 'desc' };
  
    try {
      const [products, count] = await Promise.all([
        prisma.product.findMany({
          where,
          skip: parseInt(skip),
          take: parseInt(limit),
          orderBy,
        }),
        prisma.product.count({ where }),
      ]);

      res.json({
        products,
        totalPages: Math.ceil(count / limit),
        totalProducts: count,
      });
    } catch (error) {
      console.error('Error in getProducts:', error);
      res.status(500).json({ error: error.message });
    }
  };
  

const createProduct = async (req, res) => {
  const data = req.body;

  try {
    if (Array.isArray(data)) {
      const created = await prisma.product.createMany({
        data,
        skipDuplicates: true, 
      });
      return res.status(201).json({ message: 'Products created', count: created.count });
    }

    const { name, category, price, image, description } = {
      ...req.body,
      category: req.body.category.toLowerCase(),
    };
        if (!name || !category || !price || !image || !description) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const product = await prisma.product.create({
      data: { name, category, price, image, description },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error in createProduct:', error);
    res.status(400).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, category, price, image, description } = {
    ...req.body,
    category: req.body.category.toLowerCase(),
  };
  try {
    const updated = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { name, category, price, image, description },
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error in getProductById:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  getProductById,
};
