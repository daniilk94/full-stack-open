const Header = (props) => {
  return (
      <h1>{props.course}</h1>
  );
};

const Part = (props) => {
  return (
      <p>
        Topic: {props.partName}. Number of exercises: {props.number}
      </p>
  );
};

const Content = (props) => {
  return (
    <div>
      <Part partName={props.part1} number={props.number1} />
      <Part partName={props.part2} number={props.number2} />
      <Part partName={props.part3} number={props.number3} />
    </div>
  );
};

const Total = (props) => {
  return (
      <p>Total number of exercises: {props.total}</p>
  );
};

const App = () => {
  const course = "Half Stack application development";
  const part1 = "Fundamentals of React";
  const exercises1 = 10;
  const part2 = "Using props to pass data";
  const exercises2 = 7;
  const part3 = "State of a component";
  const exercises3 = 14;

  return (
    <div>
      <Header course={course} />
      <Content
        part1={part1}
        number1={exercises1}
        part2={part2}
        number2={exercises2}
        part3={part3}
        number3={exercises3}
      />
      <Total total={exercises1 + exercises2 + exercises3} />
    </div>
  );
};

export default App;
