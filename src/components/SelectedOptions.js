import { setItem, getItem } from "./storage.js";
import { routeChange } from "./router.js";

export default function SelectedOptions({ $target, initialState }) {
  const $component = document.createElement("div");
  $target.appendChild($component);

  this.state = initialState;

  this.getTotalPrice = () => {
    const { product, selectedOptions } = this.state;
    const { price: productPrice } = product;

    return selectedOptions.reduce(
      (acc, option) =>
        acc + (productPrice + option.optionPrice) * option.quantity,
      0
    );
  };

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  this.render = () => {
    const { product, selectedOptions = [] } = this.state;

    if (product && selectedOptions) {
      $component.innerHTML = `
                  <h3>선택된 상품</h3>
                  <ul>
                      ${selectedOptions
                        .map(
                          (selectedOption) => `
                          <li>
                              ${selectedOption.optionName} ${
                            product.price + selectedOption.optionPrice
                          }원
                              <input type="text" data-optionId="${
                                selectedOption.optionId
                              }" value="${selectedOption.quantity}">
                          </li>
                      `
                        )
                        .join("")}
                  </ul>
                  <div class="ProductDetail__totalPrice">${this.getTotalPrice()}원</div>
                  <button class="OrderButton">주문하기</button>
              `;
    }
  };
  // this.render()
  $component.addEventListener("change", (e) => {
    if (e.target.tagName === "INPUT") {
      // console.log(this.state) 왜 product가 업어지는지 !!!!!!!!!!! state 값이 왜 바꼈지?
      try {
        const nextQuantity = parseInt(e.target.value);
        const nextSelectedOptions = [...this.state.selectedOptions];

        if (typeof nextQuantity === "number") {
          const { product } = initialState;
          const optionId = parseInt(e.target.dataset.optionid);
          console.log(product);
          const option = product.productOptions.find(
            (option) => option.id === optionId
          );
          const selectedOptionIndex = nextSelectedOptions.findIndex(
            (selectedOption) => selectedOption.optionId === optionId
          );
          nextSelectedOptions[selectedOptionIndex].quantity =
            option.stock >= nextQuantity ? nextQuantity : option.stock;
          this.setState({
            ...this.state,
            product,
            selectedOptions: nextSelectedOptions,
          });
          console.log(this.state);
        }
      } catch (e) {
        console.log(e);
      }
    }
  });
  this.render();

  $component.addEventListener("click", (e) => {
    console.log("!!");
    const { selectedOptions } = this.state;
    if (e.target.className === "OrderButton") {
      const cartData = getItem("products_cart", []);
      setItem(
        "products_cart",
        cartData.concat(
          selectedOptions.map((selectedOption) => ({
            productId: selectedOption.productId,
            optionId: selectedOption.optionId,
            quantity: selectedOption.quantity,
          }))
        )
      );

      routeChange("/web/cart");
    }
  });
}
