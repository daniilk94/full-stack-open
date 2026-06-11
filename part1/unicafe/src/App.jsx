import { useState } from "react";

const Header = ({ header }) => <h1>{header}</h1>;

const Button = ({ onClick, text }) => (
  <button onClick={onClick}> {text}</button>
);

const StatisticLine = (props) => {
  if (props.text === "positive") {
    return (
      <tr>
        <td>{props.text}</td>
        <td>{props.value} %</td>
      </tr>
    );
  }
  return (
      <tr>
        <td>{props.text}</td>
        <td>{props.value}</td>
      </tr>
  );
};

const Statistics = ({ good, neutral, bad, total, average, positive }) => {
  if (total === 0) {
    return <p>No feedback given</p>;
  }
  return (
    <div>
      <Header header="Statistics" />
      <table>
        <tbody>
          <StatisticLine text={"good"} value={good} />
          <StatisticLine text={"neutral"} value={neutral} />
          <StatisticLine text={"bad"} value={bad} />
          <StatisticLine text={"total"} value={total} />
          <StatisticLine text={"average"} value={average} />
          <StatisticLine text={"positive"} value={positive} />
        </tbody>
      </table>
    </div>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleButton = (button, setButton) => {
    setButton(button + 1);
  };

  const total = good + neutral + bad;
  let average = 0;
  let positive = 0;

  if (total !== 0) {
    average = (good - bad) / total;
    positive = (good / total) * 100;
  }

  return (
    <div>
      <Header header="Give Feedback" />
      <Button onClick={() => handleButton(good, setGood)} text="Good" />
      <Button
        onClick={() => handleButton(neutral, setNeutral)}
        text="Neutral"
      />
      <Button onClick={() => handleButton(bad, setBad)} text="Bad" />

      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        total={total}
        average={average}
        positive={positive}
      />
    </div>
  );
};

export default App;
