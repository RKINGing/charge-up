import { useState } from "react";
import dayjs from "dayjs";
import Navbar from "./components/Navbar";

export default function App() {
  const [bills, setBills] = useState([]);
  const [filter, setFilter] = useState("");
  const [name, setName] = useState("");

  const billsFilter = () => {
    // 在此添加根据 day 过滤 bills 的逻辑
    const today = dayjs();
    let temp = bills;
    switch (filter) {
      case "today":
        temp = bills.filter((bill) => dayjs(bill.day).isSame(today, "day"));
        break;
      case "month":
        temp = bills.filter((bill) => dayjs(bill.day).isSame(today, "month"));
        break;
      case "year":
        temp = bills.filter((bill) => dayjs(bill.day).isSame(today, "year"));
        break;
      default:
        temp = bills;
    }
      // 在此添加根据 name 过滤 bills 的逻辑
    if (name) {
      temp = temp.filter((b) => b.typeName === name);
    }
    return temp;
  };


  return (
    <>
      <Navbar></Navbar>
      <AddBills setBills={setBills} />
      <hr />
      <BillsDateFilter setFilter={setFilter} />
      <hr />
      <BillsTypeNameFilter setName={setName} />
      <hr />
      <Bills bills={billsFilter()} />
    </>
  );
}

function AddBills({ setBills }) {
  const [bill, setBill] = useState({
    type: "",
    typeName: "",
    amount: "",
    day: "",
    desc: "",
  });

  const options = ["收入", "支出"];
  const typeNames = ["购物", "交通", "餐饮", "娱乐", "奖金", "工资"];

  const addBills = (e) => {
    e.preventDefault();
    setBills((prevBills) => [...prevBills, bill]);
    setBill({
      type: "",
      typeName: "",
      amount: "",
      day: "",
      desc: "",
    });
  };

  return (
    <form onSubmit={addBills} style={{ display: 'grid', gap: '15px' }}>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <strong style={{ width: '100px', textAlign: 'right' }}>收入/支出：</strong>
    <select  className="select select-accent"
        value={bill.type}
        onChange={(e) => setBill((prev) => ({ ...prev, type: e.target.value }))}
      >
        <option  disabled={true} value="">请选择</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
  </div>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <strong style={{ width: '100px', textAlign: 'right' }}>类型：</strong>
    <select className="select select-success"
        value={bill.typeName}
        onChange={(e) =>
          setBill((prev) => ({ ...prev, typeName: e.target.value }))
        }
      >
        <option value="">请选择</option>
        {typeNames.map((typeName, index) => (
          <option key={index} value={typeName}>
            {typeName}
          </option>
        ))}
      </select>
  </div>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <strong style={{ width: '100px', textAlign: 'right' }}>金额：</strong>
    <input
        type="number"
        placeholder="Number"
        class="input input-accent" 
        value={bill.amount}
        onChange={(e) =>
          setBill((prev) => ({ ...prev, amount: e.target.value }))
        }
      />
      <p />
  </div>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <strong style={{ width: '100px', textAlign: 'right' }}>日期：</strong>
    <input
        type="date"
        className="input input-accent"
        value={bill.day}
        onChange={(e) => setBill((prev) => ({ ...prev, day: e.target.value }))}
      />
  </div>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <strong style={{ width: '100px', textAlign: 'right' }}>详情：</strong>
    <textarea
      type="text" placeholder="...  " className="textarea textarea-success"
        value={bill.desc}
        onChange={(e) => setBill((prev) => ({ ...prev, desc: e.target.value }))}
      />
  </div>
  <button 
  className="btn btn-success" 
  style={{ width: '150px' }}  // 根据需要调整数值
>
  提交
</button>
</form>
  );
}



function BillsDateFilter({ setFilter }) {
  return (
    <div>
      <label>
        <input
         type="radio"name="filter" className="radio radio-accent"
          onChange={() => setFilter("today")}
        />
        今日
      </label>
      <label>
        <input
        type="radio" className="radio radio-accent"
          name="filter"
          onChange={() => setFilter("month")}
        />
        本月
      </label>
      <label>
        <input
       type="radio" className="radio radio-accent"
          name="filter"
          onChange={() => setFilter("year")}
        />
        今年
      </label>
      <label>
        <input   type="radio" className="radio radio-accent"
          name="filter"onChange={() => setFilter("")} />
        全部
      </label>
    </div>
  );
}

function BillsTypeNameFilter({ setName }) {
  return (
    <div>
      <label>
        <input
       type="radio" className="radio radio-accent"
          name="typeName"
          onChange={() => setName("购物")}
        />
        购物
      </label>
      <label>
        <input
          type="radio" className="radio radio-accent"
          name="typeName"
          onChange={() => setName("交通")}
        />
        交通
      </label>
      <label>
        <input
       type="radio" className="radio radio-accent"
          name="typeName"
          onChange={() => setName("餐饮")}
        />
        餐饮
      </label>
      <label>
        <input
          type="radio" className="radio radio-accent"
          name="typeName"
          onChange={() => setName("娱乐")}
        />
        娱乐
      </label>
      <label>
        <input
          type="radio" className="radio radio-accent"
          name="typeName"
          onChange={() => setName("奖金")}
        />
        奖金
      </label>
      <label>
        <input
         type="radio" className="radio radio-accent"
          name="typeName"
          onChange={() => setName("工资")}
        />
        工资
      </label>
      <label>
        <input
         type="radio" className="radio radio-accent"
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
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
      {bills.map((bill, index) => (
        <div
          key={index}
          style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '16px',
            width: '300px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            transition: 'box-shadow 0.3s ease',
            '&:hover': {
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            },
            // 添加背景颜色为浅绿色 
            backgroundColor: 'rgb(0,211,144)', 
          }}
        >
          <p>
            <strong>收入/支出：</strong>
            {bill.type}
          </p>
          <p>
            <strong>类型：</strong>
            {bill.typeName}
          </p>
          <p>
            <strong>金额：</strong>
            {bill.amount}
          </p>
          <p>
            <strong>日期：</strong>
            {bill.day}
          </p>
          <p>
            <strong>详情：</strong>
            {bill.desc}
          </p>
        </div>
      ))}
    </div>
  );
}
