import pandas as pd
import os

mean_file = open("Data/F_mean_places.csv", "w")
header = "PLACES,A_1952,A_1953,A_1954,A_1955,A_1956,A_1957,A_1958,A_1959,A_1960,A_1961,A_1962,A_1963," \
         "A_1964,A_1965,A_1966,A_1967,A_1968,A_1969,A_1970,A_1971,A_1972,A_1973,A_1974,A_1975,A_1976," \
         "A_1977,A_1978,A_1979,A_1980,A_1981,A_1982,A_1983,A_1984,A_1985,A_1986,A_1987,A_1988,A_1989," \
         "A_1990,A_1991,A_1992,A_1993,A_1994,A_1995,A_1996,A_1997,A_1998,A_1999,A_2000,A_2001,A_2002," \
         "A_2003,A_2004,A_2005,A_2006,A_2007,A_2008,A_2009,A_2010,A_2011,A_2012,A_2013,A_2014,A_2015," \
         "A_2016,A_2017,A_2018,A_2019,A_2020,A_2021,A_2022,A_2023,A_2024,A_2025,A_2026,A_2027,A_2028," \
         "A_2029,A_2030,A_2031,A_2032,A_2033,A_2034,A_2035,A_2036,A_2037,A_2038,A_2039,A_2040,A_2041," \
         "A_2042,A_2043,A_2044,A_2045,A_2046,A_2047,A_2048,A_2049,A_2050,A_2051,A_2052,A_2053,A_2054," \
         "A_2055,A_2056,A_2057,A_2058,A_2059,A_2060,A_2061,A_2062,A_2063,A_2064,A_2065\n"

mean_file.write(header)

weights = range(1, 101)

for place in os.listdir("Data/Female/"):
    name_place = place[0:-4]
    mun_name = name_place[0:-4]
    is_mun = name_place[-4:]
    if (is_mun != "_mun"):
        print name_place
        df = pd.read_csv("Data/Female/"+place)
        line = name_place
        for i in df.keys():
            value = 0
            if (i != "ETA"):
                mean = 0
                tot_pop = 0
                for j in range (0, 100):
                    mean = mean + df[i][j]*weights[j]
                    tot_pop = tot_pop + df[i][j]
                value = mean/tot_pop - 1
                line = line+", "+str(value)
        mean_file.write(line)
        mean_file.write("\n")

mean_file.close()

