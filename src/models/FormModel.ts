import { FormLayout } from "antd/es/form/Form";

export interface FormModel {
  title: string;
  layout?: FormLayout;
  labelCol: number;
  wrapperCol: number;
  formItems: FormItemModel[];
}

export interface FormItemModel {
  key: string;
  value: string;
  label: string;
  placeholder: string;
  type: "default" | "select" | "checkbox" | "number" | "tel" | "file" | "email";
  lookup_item: SelectModel[];
  required: boolean;
  message: string;
  default_value: string;
}

export interface SelectModel {
  label: string;
  value: string;
}
