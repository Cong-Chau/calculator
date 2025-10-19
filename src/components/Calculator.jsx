import { Delete, X } from "lucide-react";
import { useState, useEffect } from "react";

function Calculator() {
  // Hiển thị kết quả hoặc dữ liệu nhập
  const [display, setDisplay] = useState("0");
  // Toàn bộ phép tính
  const [calculation, setCalculation] = useState("");
  // Kết quả của phép tính
  const [result, setResult] = useState(null);
  // Phép toán mới
  const [newCalculation, setNewCalculation] = useState(false);
  const [previousResult, setPreviousResult] = useState(null);

  // Xử lý nhập
  // Nhập số
  const handleInputNumber = (number) => {
    if (newCalculation) {
      setDisplay(number);
      setNewCalculation(false);
      return;
    }
    if (display === "0") {
      if (number === ".") {
        setDisplay("0.");
        return;
      }
      setDisplay(number);
    } else {
      setDisplay(display + number);
    }
  };

  // Xóa dữ phép nhập hiện tại
  const handleDeleteInput = () => {
    if (display.length === 1) {
      setDisplay("0");
    } else {
      setDisplay(display.slice(0, display.length - 1));
    }
  };

  // Xóa toàn bộ dữ liệu nhập hiện tại
  const handleClearInput = () => {
    setDisplay("0");
  };

  // Xóa toàn bộ
  const handleClearAll = () => {
    setDisplay("0");
    setCalculation("");
    setResult(null);
  };

  const safeCalculate = (expression) => {
    try {
      const sanitized = expression
        .replace(/x/g, "*")
        .replace(/÷/g, "/")
        .replace(/√/g, "Math.sqrt")
        .replace(/\^/g, "**");

      const computed = eval(sanitized);
      return isNaN(computed) ? 0 : computed;
    } catch (err) {
      console.error("Calculation error:", err);
      return 0;
    }
  };

  // Xử lý hiển thị toàn bộ phép tính
  const handleCalculationDisplay = (operation) => {
    const expression =
      calculation === "" ? display : `${calculation} ${display}`;

    const computed = safeCalculate(expression);

    setResult(computed);
    if (operation === "=") {
      setCalculation("");
      setDisplay(String(computed));
      setPreviousResult(computed);
      setNewCalculation(true);
      return;
    }
    setCalculation(String(computed) + " " + operation);
    setDisplay("0");
  };

  const handleSpecialCalculation = (operation) => {
    const currentValue = Number.parseFloat(display);

    if (operation === "percentage") {
      if (calculation !== "") {
        const parts = calculation.trim().split(" ");
        const baseValue = Number.parseFloat(parts[0]);
        const operator = parts[1];

        if (operator === "+") {
          const percentValue = (currentValue / 100) * baseValue;
          setDisplay(String(baseValue + percentValue));
        } else if (operator === "-") {
          const percentValue = (currentValue / 100) * baseValue;
          setDisplay(String(baseValue - percentValue));
        } else if (operator === "x" || operator === "*") {
          const percentValue = (currentValue / 100) * baseValue;
          setDisplay(String(percentValue));
        } else if (operator === "÷" || operator === "/") {
          const percentValue = (currentValue / 100) * baseValue;
          setDisplay(String(baseValue / percentValue));
        }
      } else {
        setDisplay(String(currentValue / 100));
      }
    }

    if (operation === "reciprocal") {
      if (currentValue === 0) {
        setDisplay("Error");
      } else {
        setDisplay(String(1 / currentValue));
      }
    }

    if (operation === "square") {
      setDisplay(String(currentValue * currentValue));
    }

    if (operation === "sqrt") {
      if (currentValue < 0) {
        setDisplay("Error");
      } else {
        setDisplay(String(Math.sqrt(currentValue)));
      }
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key;

      // Số (0-9)
      if (key >= "0" && key <= "9") {
        event.preventDefault();
        handleInputNumber(key);
      }
      // Dấu chấm
      else if (key === ".") {
        event.preventDefault();
        handleInputNumber(".");
      }
      // Phép toán
      else if (key === "+") {
        event.preventDefault();
        handleCalculationDisplay("+");
      } else if (key === "-") {
        event.preventDefault();
        handleCalculationDisplay("-");
      } else if (key === "*") {
        event.preventDefault();
        handleCalculationDisplay("x");
      } else if (key === "/") {
        event.preventDefault();
        handleCalculationDisplay("÷");
      }
      // Bằng
      else if (key === "Enter" || key === "=") {
        event.preventDefault();
        handleCalculationDisplay("=");
      }
      // Xóa ký tự cuối
      else if (key === "Backspace") {
        event.preventDefault();
        handleDeleteInput();
      }
      // Xóa tất cả
      else if (key === "Escape") {
        event.preventDefault();
        handleClearAll();
      }
      // Phần trăm
      else if (key === "%") {
        event.preventDefault();
        handleSpecialCalculation("percentage");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [display, calculation, newCalculation]);

  return (
    <div className="bg-black text-white w-4/5 md:w-1/2 lg:w-1/3 h-auto p-8 rounded-2xl flex flex-col items-center gap-6 border border-gray-400 shadow-lg">
      {/* Header */}
      <header className="font-bold text-2xl w-full">
        <p className="inline-block">Calculator</p>
      </header>
      {/* Hiển thị kết quả */}
      <div className="bg-gray-200 w-full border p-2 rounded-[7px]">
        {/* Lịch sử phép tính */}
        <div className=" flex justify-end min-h-6">
          <p className="inline-block text-gray-600">{calculation}</p>
        </div>
        {/* Kết quả và dữ liệu nhập */}
        <div className=" flex justify-end">
          <p className="inline-block text-black text-3xl font-semibold">
            {display}
          </p>
        </div>
      </div>
      {/* Chức năng thao tác */}
      <div className="w-full grid grid-cols-4 gap-4">
        {/* Hàng 1 */}
        <button
          onClick={() => handleSpecialCalculation("percentage")}
          className="bg-gray-700 border-gray-700 py-2 border rounded-[7px] hover:opacity-80"
        >
          <p className="text-center">%</p>
        </button>
        <button
          onClick={handleClearInput}
          className="bg-gray-900 border-gray-700 py-2 border rounded-[7px] hover:opacity-80"
        >
          <p className="text-center">CE</p>
        </button>
        <button
          onClick={handleClearAll}
          className="bg-gray-900 border-gray-700 py-2 border rounded-[7px] hover:opacity-80"
        >
          <p className="text-center">C</p>
        </button>
        <button
          onClick={handleDeleteInput}
          className=" bg-gray-900 border-gray-700 py-2 border rounded-[7px] flex justify-center items-center hover:opacity-80"
        >
          <Delete size={16} />
        </button>
        {/* Hàng 2 */}
        <button
          onClick={() => handleSpecialCalculation("reciprocal")}
          className="bg-gray-700 border-gray-700 py-2 border rounded-[7px] hover:opacity-80"
        >
          <p className="text-center">1/x</p>
        </button>
        <button
          onClick={() => handleSpecialCalculation("square")}
          className="bg-gray-700 border-gray-700 py-2 border rounded-[7px] hover:opacity-80"
        >
          <p className="text-center">x²</p>
        </button>
        <button
          onClick={() => handleSpecialCalculation("sqrt")}
          className="bg-gray-700 border-gray-700 py-2 border rounded-[7px] hover:opacity-80"
        >
          <p className="text-center">²√x</p>
        </button>
        <button
          onClick={() => handleCalculationDisplay("÷")}
          className="bg-orange-500 border-orange-500 py-2 border rounded-[7px] hover:opacity-80"
        >
          <p className="text-center">÷</p>
        </button>
        {/* Hàng 3 */}
        <button
          onClick={() => handleInputNumber("7")}
          className="py-2 border rounded-[7px] hover:bg-white hover:text-black"
        >
          <p className="text-center">7</p>
        </button>
        <button
          onClick={() => handleInputNumber("8")}
          className="py-2 border rounded-[7px] hover:bg-white hover:text-black"
        >
          <p className="text-center">8</p>
        </button>
        <button
          onClick={() => handleInputNumber("9")}
          className="py-2 border rounded-[7px] hover:bg-white hover:text-black"
        >
          <p className="text-center">9</p>
        </button>
        <button
          onClick={() => handleCalculationDisplay("x")}
          className="bg-orange-500 border-orange-500 py-2 border rounded-[7px] flex justify-center items-center hover:opacity-80"
        >
          <X size={14} />
        </button>
        {/* Hàng 4 */}
        <button
          onClick={() => handleInputNumber("4")}
          className="py-2 border rounded-[7px] hover:bg-white hover:text-black"
        >
          <p className="text-center">4</p>
        </button>
        <button
          onClick={() => handleInputNumber("5")}
          className="py-2 border rounded-[7px] hover:bg-white hover:text-black"
        >
          <p className="text-center">5</p>
        </button>
        <button
          onClick={() => handleInputNumber("6")}
          className="py-2 border rounded-[7px] hover:bg-white hover:text-black"
        >
          <p className="text-center">6</p>
        </button>
        <button
          onClick={() => handleCalculationDisplay("-")}
          className="bg-orange-500 border-orange-500 py-2 border rounded-[7px] hover:opacity-80"
        >
          <p className="text-center">-</p>
        </button>
        {/* Hàng 5 */}
        <button
          onClick={() => handleInputNumber("1")}
          className="py-2 border rounded-[7px] hover:bg-white hover:text-black"
        >
          <p className="text-center">1</p>
        </button>
        <button
          onClick={() => handleInputNumber("2")}
          className="py-2 border rounded-[7px] hover:bg-white hover:text-black"
        >
          <p className="text-center">2</p>
        </button>
        <button
          onClick={() => handleInputNumber("3")}
          className="py-2 border rounded-[7px] hover:bg-white hover:text-black"
        >
          <p className="text-center">3</p>
        </button>
        <button
          onClick={() => handleCalculationDisplay("+")}
          className="bg-orange-500 border-orange-500 py-2 border rounded-[7px] hover:opacity-80 "
        >
          <p className="text-center">+</p>
        </button>
        {/* Hàng 6 */}
        <button
          onClick={() => {
            if (previousResult !== null) {
              setDisplay(String(previousResult));
              setNewCalculation(true);
            }
          }}
          className="py-2 border rounded-[7px]  hover:bg-white hover:text-black"
        >
          <p className="text-center">Ans</p>
        </button>
        <button
          onClick={() => handleInputNumber("0")}
          className="py-2 border rounded-[7px] hover:bg-white hover:text-black"
        >
          <p className="text-center">0</p>
        </button>
        <button
          onClick={() => handleInputNumber(".")}
          className="py-2 border rounded-[7px] hover:bg-white hover:text-black"
        >
          <p className="text-center">.</p>
        </button>
        <button
          onClick={() => handleCalculationDisplay("=")}
          className="bg-orange-500 py-2 border rounded-[7px] border-orange-500 hover:opacity-80"
        >
          <p className="text-center font-bold">=</p>
        </button>
      </div>
    </div>
  );
}

export default Calculator;
