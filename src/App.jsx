import styled from "styled-components";
import { useState } from "react";
import { Button, Form, Table, FormCheck, FormGroup } from "react-bootstrap";
import { nanoid } from "nanoid";
import IconButton from "./components/IconButton";
import JSConfetti from "js-confetti";
import Fuse from "fuse.js";
import "./App.css";

const markets = [
  {
    id: 1,
    name: "Migros",
  },
  {
    id: 2,
    name: "Bim",
  },
  {
    id: 3,
    name: "Şok",
  },
];

const categories = [
  {
    id: 1,
    name: "Gıda",
  },
  {
    id: 2,
    name: "Elektronik",
  },
  {
    id: 3,
    name: "Giyim",
  },

  {
    id: 4,
    name: "Kozmetik",
  },
];

const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 3rem;
  gap: 1rem;
  accent-color: #95a6ff;
`;

function App() {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMarket, setSelectedMarket] = useState("");
  const jsConfetti = new JSConfetti();

  const [filterMarket, setFilterMarket] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterIsPurchased, setFilterIsPurchased] = useState("all");
  const [filterProductName, setFilterProductName] = useState("");

  const filteredProducts = products.filter((product) => {
    let result = true;

    //isPurchased
    let myProductPurchased = product.isPurchased;
    if (filterIsPurchased === true) {
      result = result && myProductPurchased === true;
    }

    if (filterIsPurchased === false) {
      result = result && myProductPurchased !== true;
    }

    //name
    if (filterProductName !== "") {
      const fuse = new Fuse(products, { keys: ["name"] });
      const isIncluded = fuse
        .search(filterProductName)
        .find((e) => e.item.id === product.id);
      result = result && isIncluded;
    }

    //market
    if (filterMarket !== "all") {
      const isIncluded = product.market == filterMarket;
      result = result && isIncluded;
    }

    //category
    if (filterCategory !== "all") {
      const isIncluded = product.category === filterCategory;
      result = result && isIncluded;
    }

    return result;
  });

  return (
    <div className=" bg-gradient">
      <div className="text-center text-white text-uppercase display-2 ">
        Shopping List
      </div>
      <Form>
        <InputWrapper>
          <Form.Control
            placeholder="Add product..."
            value={productName}
            aria-label="Small"
            aria-describedby="inputGroup-sizing-sm"
            onChange={(e) => {
              setProductName(e.target.value);
            }}
          />
          <Form.Select
            aria-label="Floating label select example"
            onChange={(e) => {
              setSelectedMarket(e.target.value);
            }}
            value={selectedMarket}
          >
            <option>Select the shop</option>
            {markets.map((market) => (
              <option value={market.id} key={market.id}>
                {market.name}
              </option>
            ))}
          </Form.Select>

          <Form.Select
            aria-label="Floating label select example"
            onChange={(e) => {
              setSelectedCategory(e.target.value);
            }}
            value={selectedCategory}
          >
            <option>Select the category</option>
            {categories.map((category) => (
              <option value={category.id} key={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Select>
          <Button
            onClick={() => {
              if (!productName || !selectedCategory || !selectedMarket) {
                alert(
                  "Please fill in the product name, shop and category fields!"
                );
                return;
              }
              const product = {
                name: productName,
                category: selectedCategory,
                market: selectedMarket,
                id: nanoid(),
              };
              setProducts([...products, product]);
            }}
          >
            Add
          </Button>
        </InputWrapper>
      </Form>
      <Form className="mb-5">
        <InputWrapper>
          <div className="bg-white rounded">
            <FormGroup
              key={`default-radio`}
              className="ms-3 me-3 px-2 my-2 d-flex  gap-2"
              style={{ width: "max-content" }}
            >
              <Form.Check
                type={"radio"}
                label={`All`}
                id={`default-radio-0`}
                name="ispurchased"
                checked={filterIsPurchased === null}
                onClick={() => {
                  setFilterIsPurchased(null);
                }}
              />
              <Form.Check
                type={"radio"}
                id={`default-radio-1`}
                label={`Purchased`}
                name="ispurchased"
                checked={filterIsPurchased === true}
                onClick={() => {
                  setFilterIsPurchased(true);
                }}
              />
              <Form.Check
                type={"radio"}
                label={`Not purchased`}
                id={`default-radio-2`}
                name="ispurchased"
                checked={filterIsPurchased === false}
                onClick={() => {
                  setFilterIsPurchased(false);
                }}
              />
            </FormGroup>
          </div>
          <Form.Control
            value={filterProductName}
            placeholder="Filter product..."
            aria-label="Small"
            aria-describedby="inputGroup-sizing-sm"
            onChange={(e) => {
              setFilterProductName(e.target.value);
            }}
          />
          <Form.Select
            aria-label="Floating label select example"
            onChange={(e) => {
              setFilterMarket(e.target.value);
            }}
            value={filterMarket}
          >
            <option value={"all"}>All shops</option>
            {markets.map((market) => (
              <option value={market.id} key={market.id}>
                {market.name}
              </option>
            ))}
          </Form.Select>

          <Form.Select
            aria-label="Floating label select example"
            onChange={(e) => {
              setFilterCategory(e.target.value);
            }}
            value={filterCategory}
          >
            <option value={"all"}>All categories</option>
            {categories.map((category) => (
              <option value={category.id} key={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Select>
        </InputWrapper>
      </Form>
      <div className="px-5 text-center ">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Shop Name</th>
              <th>Category Name</th>
              <th>Purchased</th>
              <th>Delete Product</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr
                style={{
                  cursor: "pointer",
                  textDecoration: product.isPurchased
                    ? "line-through"
                    : "unset",
                }}
                onClick={() => {
                  let copyProducts = [...products];
                  copyProducts = copyProducts.map((e) => {
                    if (e.id === product.id) {
                      e.isPurchased = e.isPurchased === true ? false : true;
                    }
                    return e;
                  });
                  if (copyProducts.every((p) => p.isPurchased === true)) {
                    jsConfetti.addConfetti(alert("Shopping Completed!"));
                  }
                  setProducts(copyProducts);
                }}
                key={product.id}
              >
                <td>{product.name}</td>
                <td>
                  {markets.find((market) => market.id == product.market)?.name}
                </td>
                <td>
                  {
                    categories.find(
                      (category) => category.id == product.category
                    )?.name
                  }
                </td>
                <td className="text-center">
                  <FormCheck checked={product.isPurchased} />
                </td>
                <td
                  onClick={(e) => {
                    e.stopPropagation();
                    const deleteProducts = products.filter(
                      (a) => a.id !== product.id
                    );
                    setProducts(deleteProducts);
                  }}
                  className="text-center"
                >
                  <IconButton />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default App;
