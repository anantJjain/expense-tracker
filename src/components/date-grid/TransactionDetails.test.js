import React from "react";
import { render, screen } from "@testing-library/react";
import TransactionDetails from "./TransactionDetails";
import { transactions } from "../../transaction";

jest.mock('react-chartjs-2', () => ({
    Line: jest.fn(() => null), // Replace Line component with a mock function
}));

describe("TransactionDetails component", () => {

  test("Renders 'No transactions made on this date' when data is empty and isOpen is true", () => {
    render(<TransactionDetails data={[]} isOpen={true} />);
    const noTransactionsText = screen.getByText(/No transactions made on this date/i);
    expect(noTransactionsText).toBeInTheDocument();
  });

  test("Renders correct number of transactions", () => {
    render(<TransactionDetails data={transactions} isOpen={true} />);
    const transactionCountText = screen.getByText(/Number of Transactions/i);
    expect(transactionCountText).toBeInTheDocument();
  });


  test("Renders total spending sign correctly credit", () => {
    const testData = [
      { type: "debit", amount: 100 },
      { type: "credit", amount: 200 }
    ];
    render(<TransactionDetails data={testData} isOpen={true} />);
    const totalSpendingText = screen.getByTestId("total-amount-today-sign");
    expect(totalSpendingText).toHaveTextContent('+');
  });

  test("Renders total spending sign correctly debit", () => {
    const testData = [
      { type: "credit", amount: 100 },
      { type: "debit", amount: 200 }
    ];
    render(<TransactionDetails data={testData} isOpen={true} />);
    const totalSpendingText = screen.getByTestId("total-amount-today-sign");
    expect(totalSpendingText).toHaveTextContent('-');
  });

  test("Renders total spending value correctly", () => {
    const testData = [
      { type: "debit", amount: 100 },
      { type: "credit", amount: 200 }
    ];
    render(<TransactionDetails data={testData} isOpen={true} />);
    const totalSpendingText = screen.getByTestId("total-amount-today-value");
    expect(totalSpendingText).toHaveTextContent('₹100.00');
  });

  test("Renders correct arrow icon based on total spending credit", () => {
    const testData = [
      { type: "credit", amount: 100 },
      { type: "debit", amount: 200 }
    ];
    render(<TransactionDetails data={testData} isOpen={true} />);
    const arrowIcon = screen.getByTestId("arrow-icon");
    expect(arrowIcon).toHaveClass("text-red-600"); // Assuming the arrow icon has a class based on the color
  });

  test("Renders correct arrow icon based on total spending debit", () => {
    const testData = [
      { type: "debit", amount: 100 },
      { type: "credit", amount: 200 }
    ];
    render(<TransactionDetails data={testData} isOpen={true} />);
    const arrowIcon = screen.getByTestId("arrow-icon");
    expect(arrowIcon).toHaveClass("text-green-500"); // Assuming the arrow icon has a class based on the color
  });

  test("Renders chart correctly", () => {
    const testData = [
      { type: "debit", amount: 100 },
      { type: "credit", amount: 200 }
    ];
    render(<TransactionDetails data={testData} isOpen={true} />);
    const chart = screen.getByTestId("transaction-chart");
    expect(chart).toBeInTheDocument();
  });
});
