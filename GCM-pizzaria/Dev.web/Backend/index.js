const path = require('path');

const express = require("express");
const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.use(express.json());

const cardapio=[
    {id:1,nome:"Calabresa Acebolada",preco:35},
    {id:2,nome:"Calabresa Especial",preco:35},
    {id:3,nome:"Frango com Catupiry",preco:35},
    {id:4,nome:"Frango Especial GCM",preco:35},
    {id:5,nome:"Portuguesa",preco:35},
    {id:6,nome:"Moda da casa",preco:35},
    {id:7,nome:"Americana",preco:35},
    {id:8,nome:"4 Queijos",preco:35},
    {id:9,nome:"Marguerita",preco:35},
    {id:10,nome:"Lombo",preco:35},
    {id:11,nome:"Nordestina",preco:35},
    {id:12,nome:"Garanhuns",preco:35},
];

let carrinho=[];
let proxPedidos=1;


app.get("/pizzas",(req,res)=>{
    res.json(cardapio);
});

app.post("/pedidos", (req, res) => {
  const { pizzaId, quantidade } = req.body;

  const pizza = cardapio.find(p => p.id === pizzaId);

  if (!pizza) {
    return res.status(404).json({ mensagem: "Pizza não encontrada" });
  }

  const subtotal = pizza.preco * quantidade;

  carrinho.push({
    id:proxPedidos++,
    pizza: pizza.nome,
    quantidade,
    subtotal
  });

  res.json({ mensagem: "Pedido adicionado", subtotal });
});

app.get("/pedidos", (req, res) => {
  res.json(carrinho);
});


app.delete("/pedidos/:id",(req,res)=>{
    const id=Number(req.params.id);
    const index= carrinho.findIndex(p=>p.id===id);

    if(index===-1){
        res.status(404).json({mensagem:"Pedido não encontrado."});
    }
    carrinho.splice(index,1);
    res.json({mensagem:"Pedido removido com sucesso."})
});

app.get("/pedidos/total",(req,res)=>{
    const total=carrinho.reduce((soma,p)=>soma+p.subtotal,0);
    res.json({total});
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});

app.post("/finalizar",(req,res)=>{
  const dados=req.body;
  res.status(200).send("Pedido finalizado.",dados);
  console.log("Pedido processado.")
});

app.delete("/pedidos", (req,res)=>{
  carrinho=[];
  res.send("Carrinho esvaziado");
});