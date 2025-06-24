import csv

with open("GSU_Grad_DQ.csv", newline='') as f:
    reader = csv.DictReader(f)
    for i, row in enumerate(reader):
        print(f"\n--- Row {i+1} ---")
        for key in row:
            print(f"{key}: {row[key]}")
        if i >= 1:
            break  # Just preview first 2 rows
