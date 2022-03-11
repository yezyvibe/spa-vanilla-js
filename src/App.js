import ProductListPage from "./pages/ProductListPage.js";
import ProductDetailPage from "./pages/ProductDetailPage.js";
import CartPage from "./pages/CartPage.js";
import { init } from "./components/router.js";

export default function App({ $target }) {
  this.route = () => {
    const { pathname } = location;
    $target.innerHTML = "";
    if (pathname === "/web/") {
      new ProductListPage({ $target }).render();
    } else if (pathname.substring(0, 14) === "/web/products/") {
      const [, , , productId] = pathname.split("/");
      new ProductDetailPage({
        $target,
        productId,
      }).render();
    } else if (pathname === "/web/cart") {
      new CartPage({
        $target,
      }).render();
    }
  };

  this.route();

  init(this.route);
  this.route();

  window.addEventListener("popstate", this.route);
}
