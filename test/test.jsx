// React JSX - Mal indentado propositalmente
import React, { useState, useEffect } from 'react';
function App() {
const [count, setCount] = useState(0);
const [items, setItems] = useState([]);
useEffect(() => {
fetch('/api/items')
.then(res => res.json())
.then(data => {
if(data && data.length > 0){
setItems(data);
}
});
}, []);
const handleClick = () => {
setCount(count + 1);
if(count >= 10){
alert('Maximum reached!');
}
};
return (
<div className="app">
<header>
<h1>React App</h1>
</header>
<main>
<button onClick={handleClick}>
Count: {count}
</button>
<ul>
{items.map(item => (
<li key={item.id}>
{item.name}
</li>
))}
</ul>
</main>
</div>
);
}
export default App;

