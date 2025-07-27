import { useState, useEffect } from "react";
import dayjs from "dayjs";
import Navbar from "./components/Navbar";

export default function App() {
  // 从本地存储加载账单数据
  const [bills, setBills] = useState(() => {
    const savedBills = localStorage.getItem("bills");
    return savedBills ? JSON.parse(savedBills) : [];
  });
  
  const [filter, setFilter] = useState("");
  const [name, setName] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  // 保存账单到本地存储
  useEffect(() => {
    localStorage.setItem("bills", JSON.stringify(bills));
  }, [bills]);

  // 切换主题
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // 应用主题
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // 账单过滤逻辑
  const billsFilter = () => {
    const today = dayjs();
    let temp = [...bills];
    
    // 日期过滤
    switch (filter) {
      case "today":
        temp = temp.filter((bill) => dayjs(bill.day).isSame(today, "day"));
        break;
      case "month":
        temp = temp.filter((bill) => dayjs(bill.day).isSame(today, "month"));
        break;
      case "year":
        temp = temp.filter((bill) => dayjs(bill.day).isSame(today, "year"));
        break;
      default:
        break;
    }
    
    // 类型过滤
    if (name) {
      temp = temp.filter((b) => b.typeName === name);
    }
    
    return temp;
  };

  // 删除账单
  const deleteBill = (index) => {
    setBills(bills.filter((_, i) => i !== index));
  };

  // 开始编辑账单
  const startEditing = (index, bill) => {
    setEditingIndex(index);
    setBillForm(bill);
  };

  // 取消编辑
  const cancelEditing = () => {
    setEditingIndex(null);
    resetBillForm();
  };

  // 账单表单状态
  const [billForm, setBillForm] = useState({
    type: "",
    typeName: "",
    amount: "",
    day: dayjs().format("YYYY-MM-DD"),
    desc: "",
  });

  // 重置表单
  const resetBillForm = () => {
    setBillForm({
      type: "",
      typeName: "",
      amount: "",
      day: dayjs().format("YYYY-MM-DD"),
      desc: "",
    });
  };

  // 添加/更新账单
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingIndex !== null) {
      // 更新现有账单
      const updatedBills = [...bills];
      updatedBills[editingIndex] = billForm;
      setBills(updatedBills);
      setEditingIndex(null);
    } else {
      // 添加新账单
      setBills([...bills, billForm]);
    }
    
    resetBillForm();
  };

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar toggleTheme={toggleTheme} theme={theme} />
      <div className="container mx-auto p-4">
        <AddBills 
          billForm={billForm} 
          setBillForm={setBillForm} 
          handleSubmit={handleSubmit}
          editingIndex={editingIndex}
          cancelEditing={cancelEditing}
        />
        
        <div className="divider"></div>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <BillsDateFilter setFilter={setFilter} currentFilter={filter} />
          <BillsTypeNameFilter setName={setName} currentName={name} />
        </div>
        
        <div className="divider"></div>
        
        <Bills 
          bills={billsFilter()} 
          deleteBill={deleteBill} 
          startEditing={startEditing} 
        />
      </div>
    </div>
  );
}

function AddBills({ billForm, setBillForm, handleSubmit, editingIndex, cancelEditing }) {
  const options = ["收入", "支出"];
  const typeNames = ["购物", "交通", "餐饮", "娱乐", "奖金", "工资"];

  return (
    <div className="card bg-base-200 shadow-xl p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">
        {editingIndex !== null ? "编辑账单" : "添加新账单"}
      </h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">收入/支出</span>
          </label>
          <select
            className="select select-bordered select-primary"
            value={billForm.type}
            onChange={(e) => setBillForm(prev => ({ ...prev, type: e.target.value }))}
            required
          >
            <option disabled value="">请选择</option>
            {options.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">类型</span>
          </label>
          <select
            className="select select-bordered select-success"
            value={billForm.typeName}
            onChange={(e) => setBillForm(prev => ({ ...prev, typeName: e.target.value }))}
            required
          >
            <option value="">请选择</option>
            {typeNames.map((typeName, index) => (
              <option key={index} value={typeName}>{typeName}</option>
            ))}
          </select>
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">金额</span>
          </label>
          <input
            type="number"
            placeholder="输入金额"
            className="input input-bordered input-primary"
            value={billForm.amount}
            onChange={(e) => setBillForm(prev => ({ ...prev, amount: e.target.value }))}
            required
            min="0"
            step="0.01"
          />
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">日期</span>
          </label>
          <input
            type="date"
            className="input input-bordered input-primary"
            value={billForm.day}
            onChange={(e) => setBillForm(prev => ({ ...prev, day: e.target.value }))}
            required
          />
        </div>
        
        <div className="form-control md:col-span-2">
          <label className="label">
            <span className="label-text font-bold">详情</span>
          </label>
          <textarea
            placeholder="账单详情..."
            className="textarea textarea-bordered textarea-success h-24"
            value={billForm.desc}
            onChange={(e) => setBillForm(prev => ({ ...prev, desc: e.target.value }))}
          />
        </div>
        
        <div className="md:col-span-2 flex gap-3 mt-2">
          {editingIndex !== null ? (
            <>
              <button type="button" className="btn btn-error flex-1" onClick={cancelEditing}>
                取消编辑
              </button>
              <button type="submit" className="btn btn-success flex-1">
                更新账单
              </button>
            </>
          ) : (
            <button type="submit" className="btn btn-success w-full">
              添加账单
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function BillsDateFilter({ setFilter, currentFilter }) {
  const filters = [
    { value: "today", label: "今日" },
    { value: "month", label: "本月" },
    { value: "year", label: "今年" },
    { value: "", label: "全部" }
  ];

  return (
    <div className="card bg-base-200 p-4 w-full md:w-auto">
      <h3 className="font-bold mb-2">日期筛选</h3>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter, index) => (
          <button
            key={index}
            className={`btn btn-sm ${currentFilter === filter.value ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function BillsTypeNameFilter({ setName, currentName }) {
  const typeNames = ["购物", "交通", "餐饮", "娱乐", "奖金", "工资", ""];
  const labels = {
    "": "全部",
    "购物": "购物",
    "交通": "交通",
    "餐饮": "餐饮",
    "娱乐": "娱乐",
    "奖金": "奖金",
    "工资": "工资"
  };

  return (
    <div className="card bg-base-200 p-4 w-full md:w-auto">
      <h3 className="font-bold mb-2">类型筛选</h3>
      <div className="flex flex-wrap gap-2">
        {typeNames.map((name, index) => (
          <button
            key={index}
            className={`btn btn-sm ${currentName === name ? 'btn-accent' : 'btn-outline'}`}
            onClick={() => setName(name)}
          >
            {labels[name]}
          </button>
        ))}
      </div>
    </div>
  );
}

function Bills({ bills, deleteBill, startEditing }) {
  if (bills.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">📝</div>
        <h3 className="text-xl font-bold">暂无账单记录</h3>
        <p className="text-gray-500">请添加新的账单记录</p>
      </div>
    );
  }

  // 计算总收入与总支出
  const totalIncome = bills
    .filter(bill => bill.type === "收入")
    .reduce((sum, bill) => sum + parseFloat(bill.amount || 0), 0);
  
  const totalExpense = bills
    .filter(bill => bill.type === "支出")
    .reduce((sum, bill) => sum + parseFloat(bill.amount || 0), 0);
  
  const balance = totalIncome - totalExpense;

  return (
    <div>
      <div className="stats shadow mb-6 w-full">
        <div className="stat">
          <div className="stat-title">总收入</div>
          <div className="stat-value text-success">¥{totalIncome.toFixed(2)}</div>
        </div>
        
        <div className="stat">
          <div className="stat-title">总支出</div>
          <div className="stat-value text-error">¥{totalExpense.toFixed(2)}</div>
        </div>
        
        <div className="stat">
          <div className="stat-title">结余</div>
          <div className={`stat-value ${balance >= 0 ? 'text-success' : 'text-error'}`}>
            ¥{balance.toFixed(2)}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bills.map((bill, index) => (
          <div key={index} className="card bg-base-100 shadow-lg">
            <div className={`card-body ${bill.type === "收入" ? 'bg-success/10' : 'bg-error/10'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className={`card-title ${bill.type === "收入" ? 'text-success' : 'text-error'}`}>
                    {bill.typeName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {dayjs(bill.day).format("YYYY-MM-DD")}
                  </p>
                </div>
                <div className="badge badge-lg badge-outline">
                  {bill.type}
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-2xl font-bold">
                  ¥{parseFloat(bill.amount).toFixed(2)}
                </p>
                <p className="mt-2">
                  {bill.desc || "暂无描述"}
                </p>
              </div>
              
              <div className="card-actions justify-end mt-4">
                <button 
                  className="btn btn-sm btn-outline btn-primary"
                  onClick={() => startEditing(index, bill)}
                >
                  编辑
                </button>
                <button 
                  className="btn btn-sm btn-outline btn-error"
                  onClick={() => deleteBill(index)}
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}