import pandas as pd
from openpyxl import load_workbook

def fill_excel_template(data):
    template_path = "template.xlsx"
    df = pd.DataFrame([data])
    output_path = f"output/{data['invoice_number']}.xlsx"
    df.to_excel(output_path, index=False)
    return output_path
