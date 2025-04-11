import pandas as pd

def fill_template(data):
    df = pd.DataFrame([data])
    path = "output/invoice.xlsx"
    df.to_excel(path, index=False)
    return path
