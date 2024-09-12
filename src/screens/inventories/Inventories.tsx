import { Button } from "antd";
import React, { useState } from "react";
import { ModalAddProduct } from "../../modals";
import { Link } from "react-router-dom";

const Inventories = () => {
  const [isVisbleModalAddProduct, setIsVisbleModalAddProduct] = useState(false);

  return (
    <div>
      <Link to={`/inventory/add-product`}>Add new Product</Link>

      <ModalAddProduct
        visible={isVisbleModalAddProduct}
        onClose={() => setIsVisbleModalAddProduct(false)}
      />
    </div>
  );
};

export default Inventories;
