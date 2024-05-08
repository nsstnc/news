import './App.css';
import React, { useEffect, useState } from "react";
//импортируем компонент из другого файла
import ArticleData from './ArticleData';




function App() {
  // массив статей
  const [articles, setArticles] = useState([]);
  // массив счетчиков для каждого элемента article
  const [counts, setCounts] = useState([]);


  // функция получения данных с бэка
  const getApiData = async () => {
    const response = await fetch(
        "https://localhost:5001/articles",
    ).then((response) => response.json());
    // обновляем массив статей
    setArticles(response);
    // обновляем массив счетчиков
    setCounts(Array(response.length).fill(0));
  };

  useEffect(() => {
    getApiData();
  }, []);


  console.log(counts)



  // функция обновления счетчиков
  const incrementCounts = (index) => {
    setCounts(prevCounts => {
      const newCounts = [...prevCounts];
      newCounts[index]++;
      return newCounts;
    });
  };


  return (
      <div className="container">
        {articles.map((article, index) => (
            // применяем внешний компонент к каждой полученной новости
            <ArticleData index={index} count={counts[index]} incrementCounts={incrementCounts} article={article} />
        ))}
        <form action="https://localhost:5001/delete_last">
          <button type="submit">Удалить последнее</button>
        </form>
      </div>

  );
}

export default App;
