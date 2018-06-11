import urllib, json
from pathlib2 import Path

# do it for regions
urlPlaces = "http://apistat.istat.it/?q=getdim&dataset=DCIS_RICPOPRES1991&lang=0"
json_info = json.load(urllib.urlopen(urlPlaces))
keys = json_info.keys()

ages_codes = []
for i in range(100):
    ages_codes.append(json_info[keys[2]][i]['Cod'])

sesso = "2"  # 1=M, 2=F
mun = True

for i in range(8136, len(json_info['Territorio'])):

    desc = json_info['Territorio'][i]['Desc'].upper().strip()  # Nomi dei luoghi
    code = json_info['Territorio'][i]['Cod']  # Codice dei luoghi
    if desc.find("/") != -1:
        desc = desc[0:desc.find("/")].strip()
    path_file = "DData/" + desc + ".csv"
    my_file = Path(path_file)
    if my_file.is_file():
        path_file = "DData/" + desc + "_mun.csv"
    outfile = open(path_file, "w")
    headerAll = "ETA,A_1952,A_1953,A_1954,A_1955,A_1956,A_1957,A_1958,A_1959,A_1960,A_1961,A_1962,A_1963,A_1964,A_1965,A_1966,A_1967,A_1968,A_1969,A_1970,A_1971,A_1972,A_1973,A_1974,A_1975,A_1976,A_1977,A_1978,A_1979,A_1980,A_1981,A_1982,A_1983,A_1984,A_1985,A_1986,A_1987,A_1988,A_1989,A_1990,A_1991,A_1992,A_1993,A_1994,A_1995,A_1996,A_1997,A_1998,A_1999,A_2000,A_2001,A_2002,A_2003,A_2004,A_2005,A_2006,A_2007,A_2008,A_2009,A_2010,A_2011,A_2012,A_2013,A_2014,A_2015,A_2016,A_2017,A_2018,A_2019,A_2020,A_2021,A_2022,A_2023,A_2024,A_2025,A_2026,A_2027,A_2028,A_2029,A_2030,A_2031,A_2032,A_2033,A_2034,A_2035,A_2036,A_2037,A_2038,A_2039,A_2040,A_2041,A_2042,A_2043,A_2044,A_2045,A_2046,A_2047,A_2048,A_2049,A_2050,A_2051,A_2052,A_2053,A_2054,A_2055,A_2056,A_2057,A_2058,A_2059,A_2060,A_2061,A_2062,A_2063,A_2064,A_2065\n"
    headerReduced = "ETA,A_1982,A_1983,A_1984,A_1985,A_1986,A_1987,A_1988,A_1989,A_1990,A_1991,A_1992,A_1993,A_1994,A_1995,A_1996,A_1997,A_1998,A_1999,A_2000,A_2001,A_2002,A_2003,A_2004,A_2005,A_2006,A_2007,A_2008,A_2009,A_2010,A_2011,A_2012,A_2013,A_2014,A_2015,A_2016,A_2017\n"

    if mun:
        outfile.write(headerReduced)
    else:
        outfile.write(headerAll)

    for age in range(100):
        line = str(age)

        if mun == False:
            # Anni 1952-1971 -- No Prov e Mun
            url1 = "http://apistat.istat.it/?q=getdatajsonnuts&dataset=DCIS_RICPOPRES1971&dim=" + str(code) + ",1," + str(
                ages_codes[age]) + "," + sesso + ",0&lang=0"
            data1 = json.load(urllib.urlopen(url1))
            values = data1["IDTIME"]["value"]
            for j in range(20):
                line = line + "," + str(values[j])

            # Anni 1972-1981 -- No Prov e Mun
            url2 = "http://apistat.istat.it/?q=getdatajsonnuts&dataset=DCIS_RICPOPRES1981&dim=" + str(
                code) + ",1," + str(ages_codes[age]) + "," + sesso + ",0&lang=0"  # Anni 1952-1971 -- No Prov e Mun
            data1 = json.load(urllib.urlopen(url2))
            values = data1["IDTIME"]["value"]
            for j in range(10):
                line = line + "," + str(values[j])

        # Anni 1982-1991 -- All
        url3 = "http://apistat.istat.it/?q=getdatajsonnuts&dataset=DCIS_RICPOPRES1991&dim=" + str(
            code) + ",1," + str(ages_codes[age]) + "," + sesso + ",0&lang=0"  # Anni 1952-1971 -- No Prov e Mun
        data1 = json.load(urllib.urlopen(url3))
        values = data1["IDTIME"]["value"]
        for j in range(10):
            line = line + "," + str(values[j])

        # Anni 1992-2001 -- All
        url4 = "http://apistat.istat.it/?q=getdatajsonnuts&dataset=DCIS_RICPOPRES2001&dim=" + str(
            code) + ",1," + str(ages_codes[age]) + "," + sesso + ",0&lang=0"  # Anni 1952-1971 -- No Prov e Mun
        data1 = json.load(urllib.urlopen(url4))
        values = data1["IDTIME"]["value"]
        for j in range(10):
            line = line + "," + str(values[j])

        # Anni 2002-2011 -- All
        url5 = "http://apistat.istat.it/?q=getdatajsonnuts&dataset=DCIS_RICPOPRES2011&dim=" + str(
            code) + ",1," + str(ages_codes[age]) + "," + sesso + ",7,0&lang=0"  # Anni 1952-1971 -- No Prov e Mun
        data1 = json.load(urllib.urlopen(url5))
        values = data1["IDTIME"]["value"]
        for j in range(10):
            line = line + "," + str(values[j])

        # Anni 2012-2017 -- All
        url6 = "http://apistat.istat.it/?q=getdatajsonnuts&dataset=DCIS_POPRES1&dim=" + str(
            code) + ",1," + sesso + "," + str(ages_codes[age]) + ",8,0&lang=0"  # Anni 1952-1971 -- No Prov e Mun
        data1 = json.load(urllib.urlopen(url6))
        values = data1["IDTIME"]["value"]
        for j in range(6):
            line = line + "," + str(values[j])

        if mun == False:
            # Anni 2017-2065 -- No Prov e Mun
            url7 = "http://apistat.istat.it/?q=getdatajsonnuts&dataset=DCIS_PREVDEM1&dim=" + str(
                code) + ",1,5," + str(ages_codes[age]) + "," + sesso + ",0&lang=0"  # Anni 1952-1971 -- No Prov e Mun
            data1 = json.load(urllib.urlopen(url7))
            values = data1["IDTIME"]["value"]
            for j in range(48):
                line = line + "," + str(values[j])

        line = line + "\n"
        outfile.write(line)
        print desc
        outfile.close()
