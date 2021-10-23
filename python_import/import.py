import pandas as pd
from psycopg2.extras import RealDictCursor
import psycopg2
import random

df = pd.read_csv("part_data.csv")
conn = psycopg2.connect("dbname=climathon user=postgres password=root host=localhost")
cur = conn.cursor()

binTypes = ['BRO', 'Gastro', 'KBRO', 'Odpad z čistenia ulic', 'Odpad zo ZZ',
       'Papier', 'Plast', 'Sklo', 'Zmiešaný odpad']

c_type = random.choice(binTypes)
rows = zip(df.hash,df.Objem, df['Materiál nádoby'],df['KU - městská část'],df['KU - městský obvod'],
           df['KU - ulice'],df['lat'],df['long'],df['KU - číslo orientační'],df['Název stanoviště'],df['Číslo stanoviště'],c_type,
           df['Kód nádoby'],df['Počet nádob'],df['Rajón'],df['T1'],df['T2'],df['T3'],df['T4'],df['Provozovna'])




cur.executemany("""
 INSERT INTO bins(id, volume_in_litres, material, city_part, city_district, street, lat, lng, orientation_number, station_name, station_number, waste_type, bin_code, bin_count, region, t1, t2, t3, t4, establishment)
 (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s""", rows)


conn.commit()
cur.close()
conn.close()