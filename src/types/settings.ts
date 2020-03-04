export type Settings = {
  logo: string;
  logoUrl: string;
  name: string;
  uses_tables: boolean;
  uses_kitchen: boolean;
  uses_promotions: boolean;
  print_client_receipt: boolean;
  uses_fiscality: boolean;
  receipt_show_sum_weight: boolean;
  remain_in_category: boolean;
  forbid_precheck: boolean;
  duplicate_receipt: boolean;
  duplicate_fiscal_receipt: boolean;
  default_print: boolean;
  fast_pay_order: boolean;
  print_wifi: boolean;
  uses_prediction: boolean;
  wifi_name: string;
  wifi_pass: string;
  tip_amount: number;
  print_transaction_comment: boolean;
  lang: string;
  timezone: string;
  currency_code_iso: string;
  currency: string;
  currency_symbol: string;
  payment_methods: PaymentMethod[];
};

export type PaymentMethod = {
  paymentMethodId: number;
  title: string;
  icon: string;
  color: string;
  isActive: boolean;
};
