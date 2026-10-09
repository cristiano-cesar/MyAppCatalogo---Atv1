
import express, { Request, Response } from "express";
import { prisma } from "./prisma";

const app = express();
const PORT = 3001;

app.use(express.json());

// Verifica se a API está funcionando
app.get("/", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Lista todos os produtos cadastrados
app.get("/produtos", async (req: Request, res: Response) => {
  try {
    const produtos = await prisma.produto.findMany({
      orderBy: { id: "asc" },
    });

    res.json(produtos);
  } catch (erro) {
    console.error("Erro ao listar produtos:", erro);
    res.status(500).json({
      erro: "Não foi possível consultar os produtos.",
    });
  }
});


app.get("/produtos/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({
      erro: "O ID deve ser um número inteiro positivo.",
    });
    return;
  }

  try {
    const produto = await prisma.produto.findUnique({
      where: { id },
    });

    if (!produto) {
      res.status(404).json({
        erro: "Produto não encontrado.",
      });
      return;
    }

    res.json(produto);
  } catch (erro) {
    console.error("Erro ao consultar produto:", erro);
    res.status(500).json({
      erro: "Não foi possível consultar o produto.",
    });
  }
});


app.post("/produtos", async (req: Request, res: Response) => {
  const { nome, descricao, preco } = req.body;

  if (
    typeof nome !== "string" ||
    nome.trim() === "" ||
    typeof descricao !== "string" ||
    descricao.trim() === "" ||
    preco === undefined ||
    preco === null ||
    (typeof preco !== "string" && typeof preco !== "number") ||
    String(preco).trim() === "" ||
    !Number.isFinite(Number(preco)) ||
    Number(preco) <= 0
  ) {
    res.status(400).json({
      erro: "Informe nome, descrição e preço válido maior que zero.",
    });
    return;
  }

  try {
    const produto = await prisma.produto.create({
      data: {
        nome: nome.trim(),
        descricao: descricao.trim(),
        preco: String(preco),
      },
    });

    res.status(201).json(produto);
  } catch (erro: any) {
    if (erro.code === "P2002") {
      res.status(409).json({
        erro: "Já existe um produto com esse nome.",
      });
      return;
    }

    console.error("Erro ao cadastrar produto:", erro);
    res.status(500).json({
      erro: "Não foi possível cadastrar o produto.",
    });
  }
});


app.put("/produtos/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { nome, descricao, preco } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({
      erro: "O ID deve ser um número inteiro positivo.",
    });
    return;
  }

  if (
    typeof nome !== "string" ||
    nome.trim() === "" ||
    typeof descricao !== "string" ||
    descricao.trim() === "" ||
    preco === undefined ||
    preco === null ||
    (typeof preco !== "string" && typeof preco !== "number") ||
    String(preco).trim() === "" ||
    !Number.isFinite(Number(preco)) ||
    Number(preco) <= 0
  ) {
    res.status(400).json({
      erro: "Informe nome, descrição e preço válido maior que zero.",
    });
    return;
  }

  try {
    const produto = await prisma.produto.update({
      where: { id },
      data: {
        nome: nome.trim(),
        descricao: descricao.trim(),
        preco: String(preco),
      },
    });

    res.json(produto);
  } catch (erro: any) {
    if (erro.code === "P2025") {
      res.status(404).json({
        erro: "Produto não encontrado.",
      });
      return;
    }

    if (erro.code === "P2002") {
      res.status(409).json({
        erro: "Já existe outro produto com esse nome.",
      });
      return;
    }

    console.error("Erro ao atualizar produto:", erro);
    res.status(500).json({
      erro: "Não foi possível atualizar o produto.",
    });
  }
});


app.delete("/produtos/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({
      erro: "O ID deve ser um número inteiro positivo.",
    });
    return;
  }

  try {
    await prisma.produto.delete({
      where: { id },
    });

    res.status(200).json({
      mensagem: "Produto excluído com sucesso.",
    });
  } catch (erro: any) {
    if (erro.code === "P2025") {
      res.status(404).json({
        erro: "Produto não encontrado.",
      });
      return;
    }

    console.error("Erro ao excluir produto:", erro);
    res.status(500).json({
      erro: "Não foi possível excluir o produto.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});