'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { PaginationWrapper } from '@/components/ui';
import { Loader2, Plus, Search, Filter, Download } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Mock inventory data
const mockInventory = [
  {
    id: 1,
    name: 'Industrial Machinery Part XYZ',
    sku: 'IMP-XYZ-001',
    category: 'Machinery Parts',
    price: 12500,
    stock: 45,
    status: 'In Stock',
    image: '/globe.svg',
  },
  {
    id: 2,
    name: 'Premium Cotton Fabric',
    sku: 'PCF-002',
    category: 'Textiles',
    price: 450,
    stock: 120,
    status: 'In Stock',
    image: '/globe.svg',
  },
  {
    id: 3,
    name: 'LED Panel Lights (Pack of 10)',
    sku: 'LED-PL-003',
    category: 'Electronics',
    price: 2200,
    stock: 8,
    status: 'Low Stock',
    image: '/globe.svg',
  },
  {
    id: 4,
    name: 'Stainless Steel Kitchen Equipment',
    sku: 'SSKE-004',
    category: 'Kitchen',
    price: 18500,
    stock: 0,
    status: 'Out of Stock',
    image: '/globe.svg',
  },
  {
    id: 5,
    name: 'Organic Food Ingredients',
    sku: 'OFI-005',
    category: 'Food',
    price: 750,
    stock: 65,
    status: 'In Stock',
    image: '/globe.svg',
  },
];

export default function SellerInventory() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [inventory, setInventory] = useState(mockInventory);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const [isLoadingData, setIsLoadingData] = useState(false);

  // In a real app, we would fetch inventory data from API
  useEffect(() => {
    const fetchInventory = async () => {
      setIsLoadingData(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        // Filter based on search and tab
        let filtered = [...mockInventory];
        
        if (searchQuery) {
          filtered = filtered.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        if (currentTab === 'in-stock') {
          filtered = filtered.filter(item => item.status === 'In Stock');
        } else if (currentTab === 'low-stock') {
          filtered = filtered.filter(item => item.status === 'Low Stock');
        } else if (currentTab === 'out-of-stock') {
          filtered = filtered.filter(item => item.status === 'Out of Stock');
        }
        
        setInventory(filtered);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      } finally {
        setIsLoadingData(false);
      }
    };
    
    fetchInventory();
  }, [searchQuery, currentTab]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'seller') {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="mb-4">You need to be logged in as a seller to view this page.</p>
        <Link href="/login">
          <Button>Login as Seller</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <Link href="/seller/products/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{mockInventory.length}</div>
            <p className="text-muted-foreground">Total Products</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {mockInventory.filter(item => item.status === 'In Stock').length}
            </div>
            <p className="text-muted-foreground">In Stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {mockInventory.filter(item => item.status === 'Low Stock').length}
            </div>
            <p className="text-muted-foreground">Low Stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {mockInventory.filter(item => item.status === 'Out of Stock').length}
            </div>
            <p className="text-muted-foreground">Out of Stock</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle>Product Inventory</CardTitle>
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="w-full md:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" className="w-full md:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setCurrentTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="in-stock">In Stock</TabsTrigger>
              <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
              <TabsTrigger value="out-of-stock">Out of Stock</TabsTrigger>
            </TabsList>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingData ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        <p className="mt-2 text-sm text-muted-foreground">Loading inventory...</p>
                      </TableCell>
                    </TableRow>
                  ) : inventory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <p className="text-muted-foreground">No products found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    inventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-md overflow-hidden">
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            </div>
                            <div className="font-medium">{item.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="text-right">₹{item.price.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{item.stock}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              item.status === 'In Stock'
                                ? 'secondary'
                                : item.status === 'Low Stock'
                                ? 'outline'
                                : 'destructive'
                            }
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/seller/products/edit/${item.id}`}>
                              <Button variant="outline" size="sm">Edit</Button>
                            </Link>
                            <Button variant="outline" size="sm">View</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex items-center justify-end mt-4">
              <PaginationWrapper 
                currentPage={1} 
                totalPages={5} 
                onPageChange={(page) => console.log(`Page changed to ${page}`)} 
              />
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
