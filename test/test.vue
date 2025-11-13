<template>
<div class="container">
<h1>{{ title }}</h1>
<ul>
<li v-for="item in items" :key="item.id">
{{ item.name }}
</li>
</ul>
<button @click="handleClick">Click me</button>
</div>
</template>
<script>
export default {
data() {
return {
title: 'Test',
items: [
{ id: 1, name: 'Item 1' },
{ id: 2, name: 'Item 2' }
]
}
},
methods: {
handleClick() {
console.log('Clicked');
if(this.items.length > 0){
this.items.forEach(item => {
console.log(item);
});
}
}
}
}
</script>
<style scoped>
.container {
padding: 20px;
}
h1 {
color: #333;
}
</style>

