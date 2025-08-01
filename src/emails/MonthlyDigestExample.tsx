import MonthlyDigest from "./MonthlyDigest";

//& Example usage of the MonthlyDigest component so we can preview the email using the react-email previewer
const MonthlyDigestExample = () => {
  const sampleData = {
    familyName: "The Smith Family",
    month: "July",
    year: 2025,
    totalSpent: 325000, // $3,250.00 in cents
    previousMonthTotal: 298000, // $2,980.00 in cents
    expenses: [
      {
        _id: "expense1",
        description: "New TV",
        amount: 49900, // $499.00
        date: "2025-07-12",
        category: "Electronics",
        createdBy: "user1",
        notes: "4K Smart TV for living room",
      },
      {
        _id: "expense2",
        description: "Grocery Shopping",
        amount: 12500, // $125.00
        date: "2025-07-15",
        category: "Food",
        createdBy: "user2",
        notes: "Weekly groceries",
      },
      {
        _id: "expense3",
        description: "Gas Station",
        amount: 4500, // $45.00
        date: "2025-07-18",
        category: "Transportation",
        createdBy: "user1",
      },
    ],
    users: [
      { _id: "user1", name: "John Smith", email: "john@example.com" },
      { _id: "user2", name: "Sarah Smith", email: "sarah@example.com" },
      { _id: "user3", name: "Mike Smith", email: "mike@example.com" },
    ],
    categories: [
      {
        category: "Food",
        amount: 85000,
        percentage: 26.2,
        color: "bg-green-500",
      },
      {
        category: "Electronics",
        amount: 49900,
        percentage: 15.4,
        color: "bg-blue-500",
      },
      {
        category: "Transportation",
        amount: 45000,
        percentage: 13.8,
        color: "bg-yellow-500",
      },
      {
        category: "Entertainment",
        amount: 35000,
        percentage: 10.8,
        color: "bg-purple-500",
      },
      {
        category: "Utilities",
        amount: 28000,
        percentage: 8.6,
        color: "bg-red-500",
      },
      {
        category: "Shopping",
        amount: 25000,
        percentage: 7.7,
        color: "bg-pink-500",
      },
      {
        category: "Healthcare",
        amount: 18000,
        percentage: 5.5,
        color: "bg-indigo-500",
      },
      {
        category: "Other",
        amount: 20000,
        percentage: 6.2,
        color: "bg-orange-500",
      },
    ],
    contributors: [
      {
        userId: "user1",
        userName: "John Smith",
        totalSpent: 180000,
        percentage: 55.4,
      },
      {
        userId: "user2",
        userName: "Sarah Smith",
        totalSpent: 95000,
        percentage: 29.2,
      },
      {
        userId: "user3",
        userName: "Mike Smith",
        totalSpent: 50000,
        percentage: 15.4,
      },
    ],
    notableExpenses: [
      {
        _id: "expense1",
        description: "New TV",
        amount: 49900,
        date: "2025-07-12",
        category: "Electronics",
        createdBy: "user1",
        notes: "4K Smart TV for living room",
      },
      {
        _id: "expense4",
        description: "Vacation Booking",
        amount: 35000,
        date: "2025-07-05",
        category: "Travel",
        createdBy: "user2",
        notes: "Summer vacation to Hawaii",
      },
      {
        _id: "expense5",
        description: "Car Repair",
        amount: 28000,
        date: "2025-07-20",
        category: "Transportation",
        createdBy: "user1",
        notes: "Brake replacement and oil change",
      },
    ],
    appUrl: "https://family-expense-tracker.netlify.app/",
  };

  return <MonthlyDigest {...sampleData} />;
};

export default MonthlyDigestExample;
