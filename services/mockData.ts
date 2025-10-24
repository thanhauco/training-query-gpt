// All dates are in a format that AlaSQL can parse, like YYYY-MM-DD

export const mobilityData = {
  trips: [
    { trip_id: 'trip-1', rider_id: 'user-1', driver_id: 'driver-1', vehicle_id: 101, start_timestamp: '2023-10-26T10:00:00Z', end_timestamp: '2023-10-26T10:20:00Z', fare_amount: 15.50, city_id: 1 },
    { trip_id: 'trip-2', rider_id: 'user-2', driver_id: 'driver-2', vehicle_id: 102, start_timestamp: '2023-10-26T11:00:00Z', end_timestamp: '2023-10-26T11:30:00Z', fare_amount: 22.00, city_id: 2 },
    { trip_id: 'trip-3', rider_id: 'user-1', driver_id: 'driver-2', vehicle_id: 102, start_timestamp: '2023-10-27T14:00:00Z', end_timestamp: '2023-10-27T14:15:00Z', fare_amount: 12.75, city_id: 2 },
    { trip_id: 'trip-4', rider_id: 'user-3', driver_id: 'driver-1', vehicle_id: 101, start_timestamp: '2023-11-01T09:00:00Z', end_timestamp: '2023-11-01T09:25:00Z', fare_amount: 18.25, city_id: 1 },
    { trip_id: 'trip-5', rider_id: 'user-1', driver_id: 'driver-3', vehicle_id: 103, start_timestamp: '2024-05-20T18:00:00Z', end_timestamp: '2024-05-20T18:30:00Z', fare_amount: 25.00, city_id: 1 },
    { trip_id: 'trip-6', rider_id: 'user-4', driver_id: 'driver-3', vehicle_id: 103, start_timestamp: '2024-05-21T12:00:00Z', end_timestamp: '2024-05-21T12:15:00Z', fare_amount: 13.50, city_id: 1 },
  ],
  users: [
    { user_id: 'user-1', first_name: 'Alice', last_name: 'Smith', signup_date: '2023-01-15' },
    { user_id: 'user-2', first_name: 'Bob', last_name: 'Johnson', signup_date: '2023-03-22' },
    { user_id: 'user-3', first_name: 'Charlie', last_name: 'Brown', signup_date: '2023-09-01' },
    { user_id: 'user-4', first_name: 'Diana', last_name: 'Prince', signup_date: '2024-05-01' },
  ],
  drivers: [
    { driver_id: 'driver-1', first_name: 'David', rating: 4.8, onboarding_date: '2022-11-10' },
    { driver_id: 'driver-2', first_name: 'Eve', rating: 4.9, onboarding_date: '2023-02-20' },
    { driver_id: 'driver-3', first_name: 'Frank', rating: 4.7, onboarding_date: '2024-01-05' },
  ]
};

export const adsData = {
  ad_campaigns: [
    { campaign_id: 123, campaign_name: 'Summer Sale 2023', start_date: '2023-06-01', end_date: '2023-06-30', budget: 50000.00 },
    { campaign_id: 456, campaign_name: 'Holiday Deals', start_date: '2023-11-15', end_date: '2023-12-25', budget: 75000.00 },
    { campaign_id: 789, campaign_name: 'Spring Refresh', start_date: '2024-04-01', end_date: '2024-04-30', budget: 60000.00 },
  ],
  ad_impressions: [
    { impression_id: 'imp-1', campaign_id: 123, user_id: 'user-1', impression_timestamp: '2023-06-05T10:00:00Z', platform: 'iOS' },
    { impression_id: 'imp-2', campaign_id: 123, user_id: 'user-2', impression_timestamp: '2023-06-06T11:00:00Z', platform: 'Android' },
    { impression_id: 'imp-3', campaign_id: 456, user_id: 'user-1', impression_timestamp: '2023-11-20T14:00:00Z', platform: 'Web' },
    { impression_id: 'imp-4', campaign_id: 789, user_id: 'user-3', impression_timestamp: '2024-04-10T09:00:00Z', platform: 'iOS' },
    { impression_id: 'imp-5', campaign_id: 123, user_id: 'user-3', impression_timestamp: '2023-06-10T18:00:00Z', platform: 'iOS' },
  ],
  ad_conversions: [
    { conversion_id: 'conv-1', impression_id: 'imp-1', conversion_timestamp: '2023-06-05T10:05:00Z', revenue: 50.00 },
    { conversion_id: 'conv-2', impression_id: 'imp-3', conversion_timestamp: '2023-11-21T10:00:00Z', revenue: 120.00 },
    { conversion_id: 'conv-3', impression_id: 'imp-4', conversion_timestamp: '2024-04-10T09:30:00Z', revenue: 75.50 },
  ]
};

export const coreServicesData = {
  users: [
    { user_id: 'user-a', first_name: 'Frank', last_name: 'Castle', signup_date: '2023-01-10', city_id: 1 },
    { user_id: 'user-b', first_name: 'Jessica', last_name: 'Jones', signup_date: '2023-02-12', city_id: 2 },
    { user_id: 'user-c', first_name: 'Matt', last_name: 'Murdock', signup_date: '2023-05-30', city_id: 1 },
    { user_id: 'user-d', first_name: 'Luke', last_name: 'Cage', signup_date: '2023-05-31', city_id: 3 },
  ],
  payments: [
    { payment_id: 'pay-1', user_id: 'user-a', trip_id: 'trip-1', amount: 15.50, status: 'completed', created_at: '2023-10-26T10:21:00Z' },
    { payment_id: 'pay-2', user_id: 'user-b', trip_id: 'trip-2', amount: 22.00, status: 'completed', created_at: '2023-10-26T11:31:00Z' },
    { payment_id: 'pay-3', user_id: 'user-a', trip_id: 'trip-3', amount: 12.75, status: 'completed', created_at: '2023-10-27T14:16:00Z' },
    { payment_id: 'pay-4', user_id: 'user-c', trip_id: null, amount: 9.99, status: 'failed', created_at: '2023-11-01T10:00:00Z' },
  ],
  cities: [
    { city_id: 1, city_name: 'San Francisco', country: 'USA' },
    { city_id: 2, city_name: 'New York', country: 'USA' },
    { city_id: 3, city_name: 'London', country: 'UK' },
  ]
};

export const chinookData = {
  artists: [
    { ArtistId: 1, Name: 'AC/DC' },
    { ArtistId: 2, Name: 'Accept' },
    { ArtistId: 3, Name: 'Aerosmith' },
    { ArtistId: 4, Name: 'Iron Maiden' },
  ],
  albums: [
    { AlbumId: 1, Title: 'For Those About To Rock We Salute You', ArtistId: 1 },
    { AlbumId: 2, Title: 'Balls to the Wall', ArtistId: 2 },
    { AlbumId: 3, Title: 'Restless and Wild', ArtistId: 2 },
    { AlbumId: 4, Title: 'Powerslave', ArtistId: 4 },
    { AlbumId: 5, Title: 'The Number of the Beast', ArtistId: 4 },
  ],
  tracks: [
    { TrackId: 1, Name: 'For Those About To Rock (We Salute You)', AlbumId: 1, MediaTypeId: 1, GenreId: 1, Composer: 'Angus Young, Malcolm Young, Brian Johnson', Milliseconds: 343719, Bytes: 11170334, UnitPrice: 0.99 },
    { TrackId: 6, Name: 'Hells Bells', AlbumId: 1, MediaTypeId: 1, GenreId: 1, Composer: 'Angus Young, Malcolm Young, Brian Johnson', Milliseconds: 312619, Bytes: 10185990, UnitPrice: 0.99 },
    { TrackId: 14, Name: 'Restless and Wild', AlbumId: 3, MediaTypeId: 1, GenreId: 1, Composer: 'F. Baltes, R.A. Smith-Diesel, W. Hoffmann, U. Dirkscneider & S. Kaufman', Milliseconds: 252051, Bytes: 8303893, UnitPrice: 0.99 },
    { TrackId: 22, Name: 'The Number Of The Beast', AlbumId: 5, MediaTypeId: 1, GenreId: 1, Composer: 'Steve Harris', Milliseconds: 290226, Bytes: 9385661, UnitPrice: 0.99 },
    { TrackId: 618, Name: 'Aces High', AlbumId: 4, MediaTypeId: 1, GenreId: 1, Composer: 'Steve Harris', Milliseconds: 271031, Bytes: 8847051, UnitPrice: 0.99 },
  ],
  customers: [
    { CustomerId: 1, FirstName: 'Luís', LastName: 'Gonçalves', Company: 'Embraer - Empresa Brasileira de Aeronáutica S.A.', Country: 'Brazil', Email: 'luisg@embraer.com.br' },
    { CustomerId: 2, FirstName: 'Leonie', LastName: 'Köhler', Company: null, Country: 'Germany', Email: 'leonekohler@surfeu.de' },
    { CustomerId: 10, FirstName: 'Eduardo', LastName: 'Martins', Company: 'Woodstock Discos', Country: 'Brazil', Email: 'eduardo@woodstock.com.br' },
    { CustomerId: 20, FirstName: 'Dan', LastName: 'Miller', Company: null, Country: 'USA', Email: 'dmiller@comcast.com' },
  ],
  invoices: [
    { InvoiceId: 1, CustomerId: 2, InvoiceDate: '2009-01-01T00:00:00', BillingCountry: 'Germany', Total: 1.98 },
    { InvoiceId: 2, CustomerId: 4, InvoiceDate: '2009-01-02T00:00:00', BillingCountry: 'Norway', Total: 3.96 },
    { InvoiceId: 10, CustomerId: 20, InvoiceDate: '2009-02-03T00:00:00', BillingCountry: 'USA', Total: 13.86 },
    { InvoiceId: 50, CustomerId: 1, InvoiceDate: '2009-07-29T00:00:00', BillingCountry: 'Brazil', Total: 8.91 },
  ],
};

export const northwindData = {
  customers: [
    { CustomerID: 'ALFKI', CompanyName: 'Alfreds Futterkiste', ContactName: 'Maria Anders', City: 'Berlin', Country: 'Germany' },
    { CustomerID: 'ANATR', CompanyName: 'Ana Trujillo Emparedados y helados', ContactName: 'Ana Trujillo', City: 'México D.F.', Country: 'Mexico' },
    { CustomerID: 'ANTON', CompanyName: 'Antonio Moreno Taquería', ContactName: 'Antonio Moreno', City: 'México D.F.', Country: 'Mexico' },
    { CustomerID: 'AROUT', CompanyName: 'Around the Horn', ContactName: 'Thomas Hardy', City: 'London', Country: 'UK' },
  ],
  orders: [
    { OrderID: 10248, CustomerID: 'ALFKI', EmployeeID: 5, OrderDate: '1996-07-04T00:00:00', ShipCountry: 'Germany' },
    { OrderID: 10249, CustomerID: 'ANATR', EmployeeID: 6, OrderDate: '1996-07-05T00:00:00', ShipCountry: 'Mexico' },
    { OrderID: 10250, CustomerID: 'AROUT', EmployeeID: 4, OrderDate: '1996-07-08T00:00:00', ShipCountry: 'UK' },
    { OrderID: 10251, CustomerID: 'AROUT', EmployeeID: 3, OrderDate: '1996-07-08T00:00:00', ShipCountry: 'UK' },
  ],
  order_details: [
    { OrderID: 10248, ProductID: 11, UnitPrice: 14.00, Quantity: 12, Discount: 0 },
    { OrderID: 10248, ProductID: 42, UnitPrice: 9.80, Quantity: 10, Discount: 0 },
    { OrderID: 10249, ProductID: 14, UnitPrice: 18.60, Quantity: 9, Discount: 0 },
    { OrderID: 10250, ProductID: 41, UnitPrice: 7.70, Quantity: 10, Discount: 0 },
    { OrderID: 10250, ProductID: 51, UnitPrice: 42.40, Quantity: 35, Discount: 0.15 },
    { OrderID: 10251, ProductID: 22, UnitPrice: 16.80, Quantity: 6, Discount: 0.05 },
  ],
  products: [
    { ProductID: 11, ProductName: 'Queso Cabrales', SupplierID: 5, CategoryID: 4, UnitPrice: 21.00, UnitsInStock: 22 },
    { ProductID: 14, ProductName: 'Tofu', SupplierID: 6, CategoryID: 7, UnitPrice: 23.25, UnitsInStock: 35 },
    { ProductID: 22, ProductName: 'Gustaf\'s Knäckebröd', SupplierID: 9, CategoryID: 5, UnitPrice: 21.00, UnitsInStock: 104 },
    { ProductID: 41, ProductName: 'Jack\'s New England Clam Chowder', SupplierID: 19, CategoryID: 8, UnitPrice: 9.65, UnitsInStock: 85 },
    { ProductID: 42, ProductName: 'Singaporean Hokkien Fried Mee', SupplierID: 20, CategoryID: 5, UnitPrice: 14.00, UnitsInStock: 26 },
    { ProductID: 51, ProductName: 'Manjimup Dried Apples', SupplierID: 24, CategoryID: 7, UnitPrice: 53.00, UnitsInStock: 20 },
  ],
  employees: [
    { EmployeeID: 3, LastName: 'Leverling', FirstName: 'Janet', Title: 'Sales Representative', BirthDate: '1963-08-30T00:00:00', HireDate: '1992-04-01T00:00:00' },
    { EmployeeID: 4, LastName: 'Peacock', FirstName: 'Margaret', Title: 'Sales Representative', BirthDate: '1937-09-19T00:00:00', HireDate: '1993-05-03T00:00:00' },
    { EmployeeID: 5, LastName: 'Buchanan', FirstName: 'Steven', Title: 'Sales Manager', BirthDate: '1955-03-04T00:00:00', HireDate: '1993-10-17T00:00:00' },
    { EmployeeID: 6, LastName: 'Suyama', FirstName: 'Michael', Title: 'Sales Representative', BirthDate: '1963-07-02T00:00:00', HireDate: '1993-10-17T00:00:00' },
  ],
};
