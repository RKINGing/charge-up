import { useState } from "react";
import './App.css';
import dayjs from "dayjs";

export default function App() {
  const [bills, setBills] = useState([]);
  const [filter, setFilter] = useState("");
  const [name, setName] = useState("");

  const billsDateFilter = () => {
    const today = dayjs();
    switch (filter) {
      case "today":
        return bills.filter((bill) => dayjs(bill.day).isSame(today, "day"));
      case "month":
        return bills.filter((bill) => dayjs(bill.day).isSame(today, "month"));
      case "year":
        return bills.filter((bill) => dayjs(bill.day).isSame(today, "year"));
      default:
        return bills;
    }
  };

  const billsTypeNameFilter = (filteredBills, name) => {
    // 在此添加根据 name 过滤 bills 的逻辑
    if (name === "") {
      return filteredBills;
    } else {
      return filteredBills.filter((bill) => bill.typeName === name);
    }
  };
  

  return (
    <>
      <h1>记账本</h1>
      <AddBills setBills={setBills} />
      <hr />
      <BillsDateFilter setFilter={setFilter} />
      <hr />
      <BillsTypeNameFilter setName={setName} />
      <hr />
      <Bills bills={billsTypeNameFilter(billsDateFilter(), name)} />
    </>
  );
}

function AddBills({ setBills }) {
  const [type, setType] = useState("");
  const [typeName, setTypeName] = useState("");
  const [amount, setAmount] = useState("");
  const [day, setDay] = useState("");
  const [desc, setDesc] = useState("");

  const options = ["收入", "支出"];
  const typeNames = ["购物", "交通", "餐饮", "娱乐", "奖金", "工资"];

  const addBills = (e) => {
    e.preventDefault();
    const newBill = { type, amount, typeName, day, desc };
    setBills((prevBills) => [...prevBills, newBill]);

    setType("");
    setAmount("");
    setTypeName("");
    setDay("");
    setDesc("");
  };

  return (
    <form onSubmit={addBills}>
      <strong>收入/支出：</strong>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="">请选择</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      <p />
      <strong>类型：</strong>
      <select value={typeName} onChange={(e) => setTypeName(e.target.value)}>
        <option value="">请选择</option>
        {typeNames.map((typeName, index) => (
          <option key={index} value={typeName}>
            {typeName}
          </option>
        ))}
      </select>
      <p />
      <strong>金额：</strong>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <p />
      <strong>日期：</strong>
      <input
        type="date"
        value={day}
        onChange={(e) => setDay(e.target.value)}
      />
      <p />
      <strong>详情：</strong>
      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <p />
      <button type="submit">提交</button>
    </form>
  );
}

function BillsDateFilter({ setFilter }) {
  return (
    <div>
      <label>
        <input
          type="radio"
          name="filter"
          onChange={() => setFilter("today")}
        />
        今日
      </label>
      <label>
        <input
          type="radio"
          name="filter"
          onChange={() => setFilter("month")}
        />
        本月
      </label>
      <label>
        <input
          type="radio"
          name="filter"
          onChange={() => setFilter("year")}
        />
        今年
      </label>
    </div>
  );
}

function BillsTypeNameFilter({ setName }) {
  return (
    <div>
      <label>
        <input
          type="radio"
          name="typeName"
          onChange={() => setName("购物")}
        />
        购物
      </label>
      <label>
        <input
          type="radio"
          name="typeName"
          onChange={() => setName("交通")}
        />
        交通
      </label>
      <label>
        <input
          type="radio"
          name="typeName"
          onChange={() => setName("餐饮")}
        />
        餐饮
      </label>
      <label>
        <input
          type="radio"
          name="typeName"
          onChange={() => setName("娱乐")}
        />
        娱乐
      </label>
      <label>
        <input
          type="radio"
          name="typeName"
          onChange={() => setName("奖金")}
        />
        奖金
      </label>
      <label>
        <input
          type="radio"
          name="typeName"
          onChange={() => setName("工资")}
        />
        工资
      </label>
      <label>
        <input
          type="radio"
          name="typeName"
          onChange={() => setName("")}
        />
        全部        
      </label>
    </div>
  );
}

function Bills({ bills }) {
  return (
    <div className="bills-container">
      {bills.map((bill, index) => (
        <div className="bill-card" key={index}>
          <p><strong>收入/支出：</strong>{bill.type}</p>
          <p><strong>类型：</strong>{bill.typeName}</p>
          <p><strong>金额：</strong>{bill.amount}</p>
          <p><strong>日期：</strong>{bill.day}</p>
          <p><strong>详情：</strong>{bill.desc}</p>
        </div>
      ))}
    </div>
  );
}
