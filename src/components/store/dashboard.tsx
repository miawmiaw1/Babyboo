import React, { useEffect, useState, useRef } from 'react';
import { FetchAllOrders, type Order, type OrdersProduct } from "../../../FrontendRequests/Requests-Api/Order";
import {GetVisitor} from "../../../FrontendRequests/Requests-Api/visitors"
import { type User } from '../../../FrontendRequests/Requests-Api/User';
import { Card, Col, Row } from 'react-bootstrap';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

interface Props {
    Userprofile: User;
}

const Dashboard = ({ Userprofile }: Props) => {

  const chartRefSales = useRef<HTMLDivElement & { chart?: any }>(null);
  const chartRef = useRef<HTMLDivElement & { chart?: any }>(null);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [Orders, SetOrders] = useState<Order[] | null>(null);
  const [VisitorCount, SetVisitorCount] = useState<number>(0);
  const [filteredData, setFilteredData] = useState({
    udgifter: 0,
    indkomst: 0,
    omsaetning: 0,
    indgaaende: 0,
    udgaaende: 0
  });

  const getvisitors = async () => {
    try {
      const result = await GetVisitor()
      if (result.result) {
        SetVisitorCount(result.data?.visit as number)
      } else {
      }
    } catch (error) {
      console.error('Error Getting products:', error);
    }
  }

  const getallorders = async () => {
    try {
      const result = await FetchAllOrders()
      if (result.result) {
        SetOrders(result.data)
      } else {
      }
    } catch (error) {
      console.error('Error Getting products:', error);
    }
  };

  function filterOrdersByDate(orders: Order[], startDate: string, endDate: string): Order[] {
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    // Ensure the start and end dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return [];
    }
  
    return orders?.filter(order => {
      const orderDate = new Date(order.order_date);
      return orderDate >= start && orderDate <= end;
    }) || [];
  }
  
  function getTop3Products(orders: Order[]) {
    // Create an object to hold the count of each product

    if (!Array.isArray(orders)) {
      return {};
    }

    const productCountMap: { [key: number]: { orderProduct: OrdersProduct, count: number } } = {};

    // Loop through all orders
    orders.forEach(order => {
        // Loop through the order's products
        order.order_products?.forEach(orderProduct => {
            const productId = orderProduct.productid;

            // If this product already exists in the map, increment its count
            if (productCountMap[productId]) {
                productCountMap[productId].count += orderProduct.quantity;
            } else {
                // Otherwise, initialize it with the current order product and its count
                productCountMap[productId] = {
                    orderProduct,
                    count: orderProduct.quantity,
                };
            }
        });
    });

    // Convert the map to an array of product counts and sort by quantity in descending order
    const sortedProductCounts = Object.values(productCountMap)
        .sort((a, b) => b.count - a.count)
        .slice(0, 3); // Get top 3 most frequent products

    // Return the top 3 most frequent products in the desired format
    const topProducts: { [key: string]: { Orderproduct: OrdersProduct, Productcount: number } } = {};

    sortedProductCounts.forEach((product, index) => {
        topProducts[`top${index + 1}`] = {
            Orderproduct: product.orderProduct,
            Productcount: product.count,
        };
    });

      return topProducts;
  }

  useEffect(() => {
    getallorders();
    getvisitors();

  }, []);

  useEffect(() => {
  const topOrders = getTop3Products(Orders as Order[]);
  
  if (typeof window !== 'undefined' && (window as any).ApexCharts) {

    if (Object.keys(topOrders).length > 0) {
          // Sales Chart
          const salesChart = new (window as any).ApexCharts(chartRefSales.current, {
            chart: {
              height: 100,
              width: 110,
              parentHeightOffset: 0,
              type: 'donut',
            },
            series: Object.keys(topOrders).map(key => topOrders[key].Productcount), // Updated series data
            labels: Object.keys(topOrders).map(key => (topOrders[key].Orderproduct as any)["productname"]),
            colors: [`${import.meta.env.LIGHT_PURPLE}`, `${import.meta.env.LIGHT_BLUE}`, `${import.meta.env.LIGHT_ORANGE}`], // Example colors; replace with your config.colors values
            stroke: {
              width: 5,
              colors: ['#ffffff'], // Stroke color; replace with your 'o' value
            },
            tooltip: {
              show: false,
            },
            dataLabels: {
              enabled: false,
              formatter: function (value: number) {
                return parseInt(value as unknown as string);
              },
            },
            grid: {
              padding: {
                top: -10,
                right: -10,
                left: -10,
                bottom: -5,
              },
            },
            legend: {
              show: false,
            },
            plotOptions: {
              pie: {
                donut: {
                  size: '75%',
                  labels: {
                    show: true,
                    value: {
                      fontSize: '1.15rem',
                      fontFamily: 'Inter',
                      color: '#000000', // Value color; replace with your 'e' value
                      fontWeight: 500,
                      offsetY: -18,
                      formatter: function (value: number) {
                        return parseInt(value as unknown as string);
                      },
                    },
                    name: {
                      offsetY: 18,
                      fontFamily: 'Inter',
                    },
                    total: {
                      label: '1 Quarter', // Total label text
                      show: true,
                      fontSize: '13px',
                      fontFamily: 'Inter',
                      color: '#9e9e9e', // Total label color; replace with your 's' value
                      fontWeight: 400,
                    },
                  },
                },
              },
            },
          });
          
          if (salesChart.current?.chart) {
            salesChart.current.chart.destroy();
          }
    
          salesChart.render();
          if (salesChart.current) {
            salesChart.current.chart = salesChart;
          }
    }

    const yearlyOmseatning: Record<number, number> = {};

        Orders?.forEach(order => {
        const year = new Date(order.order_date).getFullYear();
        
        if (!yearlyOmseatning[year]) {
          yearlyOmseatning[year] = 0;
        }
        
        order.order_products.forEach((product: OrdersProduct) => {
          yearlyOmseatning[year] += product.salgpris_ex_moms - product.købspris_ex_moms;
        });
      });

      const chart = new (window as any).ApexCharts(chartRef.current, {
        chart: {
          type: "area",
          height: 400,
          toolbar: { show: false },
        },
        xaxis: {
          type: "date",
          categories: Object.keys(yearlyOmseatning).map(year => year.toString()),
        },
        dataLabels: { enabled: false },
        stroke: { curve: "smooth" },
        yaxis: { labels: { formatter: (val: number) => `DKK ${val.toFixed(0)}` } },
        series: [
          {
            name: "Omsætning",
            data: Object.values(yearlyOmseatning), // Example revenue data
          },
        ],
      });

      if (chartRef.current?.chart) {
        chartRef.current.chart.destroy();
      }

      chart.render();
      if (chartRef.current) {
        chartRef.current.chart = chart;
      }

  }
  
  }, [Orders])

  useEffect(() => {
    if (!Orders || !fromDate || !toDate) return;

    const filteredOrders = Orders.filter(order => {
      const orderDate = new Date(order.order_date);
      return orderDate >= fromDate && orderDate <= toDate;
    });

    let udgifter = 0, indkomst = 0, omsaetning = 0, indgaaende = 0, udgaaende = 0;

    filteredOrders.forEach(order => {
      order.order_products.forEach((product: OrdersProduct) => {
        udgifter += product.købspris_ex_moms;
        indkomst += product.salgpris_ex_moms;
        indgaaende += product.indgående_moms;
        udgaaende += product.udgående_moms;
      });
    });

    omsaetning = indkomst - udgifter;
    setFilteredData({ udgifter, indkomst, omsaetning, indgaaende, udgaaende });
  }, [Orders, fromDate, toDate]);



  return (
<div className="container-fluid py-4">
  <div className="row gx-4">

    {/* Left Side */}
    <div className="col-md-8 d-flex flex-column">
      {/* Tilykke Container */}
      <div className="tilykke-container mb-4">
        <div className="p-4 bg-white rounded shadow-lg d-flex justify-content-between align-items-center">
          <div>
            <h3 className="fw-bold text-dark">Tilykke {Userprofile.username} 🎉</h3>
            <p className="text-muted">
              Kunder har gennemført {filterOrdersByDate(Orders as Order[], new Date(new Date().getFullYear(), 0, 1).toISOString(), new Date().toISOString()).length} Ordre idag
            </p>
          </div>
          <div>
            {/* Profile Image */}
            <img
              src="images/avatar.jpg"
              alt="Profile"
              className="border border-2 border-light rounded-circle"
              style={{ width: '100px', height: '100px', backgroundColor: '#f0f0f0' }}
            />
          </div>
        </div>
      </div>

      {/* Revenue Container */}
      <div className="revenue-container mb-4">
        <div className="p-3 bg-white rounded shadow-sm d-flex flex-column" style={{ minHeight: '180px' }}>
          <h2 className="mt-4">Bogføring</h2>
              <p>Vælg dato:</p>
              <Row>
                <Col>
                  <DatePicker selected={fromDate} onChange={setFromDate} placeholderText="Fra" className="form-control" />
                </Col>
                <Col>
                  <DatePicker selected={toDate} onChange={setToDate} placeholderText="Til" className="form-control" />
                </Col>
              </Row>
              <Card className="p-3 shadow-sm mt-3">
                <h4 className="mb-3">Regnskab</h4>
                <Row>
                  <Col className="text-center border-end">
                    <h5>Udgifter</h5>
                    <h3 className="text-danger">{filteredData.udgifter.toFixed(2)} DKK</h3>
                  </Col>
                  <Col className="text-center border-end">
                    <h5>Indkomst</h5>
                    <h3 className="text-primary">{filteredData.indkomst.toFixed(2)} DKK</h3>
                  </Col>
                  <Col className="text-center border-end">
                    <h5>Omsætning</h5>
                    <h3 className="text-success">{filteredData.omsaetning.toFixed(2)} DKK</h3>
                  </Col>
                  <Col className="text-center border-end">
                    <h5>Indgående</h5>
                    <h3 className="text-success">{filteredData.indgaaende.toFixed(2)} DKK</h3>
                  </Col>
                  <Col className="text-center border-end">
                    <h5>Udgående</h5>
                    <h3 className="text-danger">{filteredData.udgaaende.toFixed(2)} DKK</h3>
                  </Col>
                  <div ref={chartRef} style={{ width: "100%", height: "400px" }} />
                </Row>
              </Card>
      </div>
      </div>
    </div>

    {/* Right Side */}
    <div className="col-md-4 d-flex flex-column">
      {/* Visitor Container */}
      <div className="visitor-container mb-4">
        <div className="p-4 bg-white rounded shadow-lg d-flex flex-column justify-content-end" style={{ minHeight: '150px' }}>
          <div className="avatar-wrapper mb-4" style={{ width: '50px', height: '50px' }}>
            <div
              className="avatar rounded-circle shadow-lg d-flex justify-content-center align-items-center"
              style={{
                backgroundColor: `${import.meta.env.LIGHT_BLUE}`,
                width: '50px',
                height: '50px',
              }}
            >
              <i className="mdi mdi-eye-check-outline" style={{ fontSize: '24px', color: `${import.meta.env.COLOR_WHITE}` }}></i>
            </div>
          </div>
          <div>
            <p className="text-dark fs-6 fw-semibold mb-1">Besøgende idag</p>
            <p className="fs-3 fw-bold mb-1 text-success">{VisitorCount}</p>
            <p className="text-muted fs-6 mb-0">Kunder der har besøgt hjemmesiden</p>
          </div>
        </div>
      </div>

      {/* Top Products Container */}
      <div className="col-md-12 mb-4">
        <div className="p-3 bg-white rounded shadow-lg">
          <div className="d-flex justify-content-between">
            <div className="w-60">
              <h4 className="fs-4 fw-bold text-dark">Mest købte produkter</h4>
              <p className="text-muted fs-6">Fra denne måned</p>
            </div>
            <div className="w-40 ps-3">
              <div ref={chartRefSales} style={{ width: '100%', height: '150px' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default Dashboard;