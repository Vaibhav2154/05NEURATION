import pandas as pd
import os

def fill_template(data):
    df = pd.DataFrame([data])
    
    # Create output directory if it doesn't exist
    output_dir = os.path.join(os.getcwd(), "output")
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    path = os.path.join(output_dir, "invoice.xlsx")
    df.to_excel(path, index=False)
    return path
