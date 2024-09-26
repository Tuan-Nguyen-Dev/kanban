import React, { useEffect, useState } from "react";
import { CategoryModel } from "../models/ProductModel";
import handleAPI from "../apis/handleAPI";
import { Tag } from "antd";
import { Link } from "react-router-dom";
import { listColors } from "../constants/color";

interface Props {
  id: string;
}

const CategoryComponent = (props: Props) => {
  const { id } = props;

  const [categories, setCategories] = useState<CategoryModel>();

  useEffect(() => {
    getCategoryDetail();
  }, [id]);

  const getCategoryDetail = async () => {
    const api = `/products/categories/details?id=${id}`;

    try {
      const res = await handleAPI(api);
      res.data && setCategories(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Link to={`/categories/details/${categories?.slug}?id=${id}`}>
      <Tag color={listColors[Math.floor(Math.random() * listColors.length)]}>
        {categories?.title}
      </Tag>
    </Link>
  );
};

export default CategoryComponent;
