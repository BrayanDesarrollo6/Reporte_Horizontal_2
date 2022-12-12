from django.http import HttpResponse
# Importar para manejar el contexto y asi pasar atributos o informacion
from django.template import Template, Context
# Importar cargador de plantillas
from django.template import loader
#improtar shortcuts, metodo para renderisar plantillas y optimizar codigo al cargar plantillas
from django.shortcuts import render
##Librerias para el proceso del reporte horizontal
import pandas as pd
from xlsxwriter import Workbook
from io import BytesIO
import io,csv
from openpyxl.utils.dataframe import dataframe_to_rows
from openpyxl import Workbook
from openpyxl import load_workbook

# sys: Librería con funciones y variables para manipular el entorno de ejecución.
import sys
# sys.stdin: Utilizado para ingreso interactivo de datos
# sys.stdin.readline(): Lee el contenido ingresado hasta que encuentra el carácter de salto de línea, o sea, hasta que se presiona saltar.
# nombre = sys.stdin.readline()
# print(): Imprime datos en pantalla. Cuando Python es ejecutado como un subproceso, envía los datos al programa que invocó a Python.

# sys.stdout.flush(): Fuerza la salida de datos del buffer
# sys.stdout.flush()

# #Procesos
# def procesar(request):
def procesar():
    
    print("hola")
    
    # IdPeriodo = "36638"
    IdPeriodo = "35346"
    # Dataframe final
    Horizontal = pd.DataFrame()
    #Traer información
    URL= "https://creatorapp.zohopublic.com/hq5colombia/compensacionhq5/xls/Conceptos_Nomina_Desarrollo/jwhRFUOR47TqCS9AAT82eCybwgdmgeArEtKG7U8H9s3hSjTzBd3G8bPdg37PHVygvxurxwCQvMCgHRG68dOCWKTmMWaQJU2TMwnr?ID_Periodo="+IdPeriodo
    # url_ = "https://creatorapp.zohopublic.com/hq5colombia/compensacionhq5/xls/Prenomina/WWjRAOJ2MGyyNGd5BxdvwApYGzgq5A9AQ5Q6bUmpsTQvWTMJE4qE5MyKnY4KKPXneurq8RnTZ2O698AO8N2KQ7Fa7qt4hpwSet0K?Periodo=" + _idPeriodo + "&zc_FileName=PreNomina_" + _idPeriodo;
    df = pd.read_excel(URL)
    df1 = pd.DataFrame(df)
    
    
    Contrato  = df1['Numero de Contrato'].unique().tolist()
    # print(Contrato)
    #Filtrar cada concepto unico que existe en ese reporte
    Conceptos = df1['Concepto'].unique().tolist()
    Conceptos.sort()
    ConceptosDev = []
    ConceptosDed = []
    for conceptosx in Conceptos:
        Valores = df1['Concepto'] == str(conceptosx)
        ContratoPos = df1[Valores]
        #Sumatoria
        Total = ContratoPos['Neto'].sum()
        if(Total >= 0 ):
            ConceptosDev.append(conceptosx)
        else:
            ConceptosDed.append(conceptosx)
    Conceptos.clear()
    Conceptos= ConceptosDev + ConceptosDed
    # print(Conceptos)
    #Se obtienen los datos dependiendo del empleado

    #Obtener información para agregar al nuevo data frame
    for i in Contrato:
        Valores = df1['Numero de Contrato'] == str(i)
        ContratoPos = df1[Valores]
        FilaAgregar = {}
        ##Informacion general inicial
        FilaAgregar["Temporal"] = ContratoPos.iloc[0]['Temporal']
        FilaAgregar["Empresa"] = ContratoPos.iloc[0]['Empresa']
        FilaAgregar["ID Periodo"] = ContratoPos.iloc[0]['ID Periodo']
        FilaAgregar["Tipo de Perido"] = ContratoPos.iloc[0]['Tipo de Perido']
        FilaAgregar["Mes"] = ContratoPos.iloc[0]['Mes']
        FilaAgregar["Numero de Contrato"] = ContratoPos.iloc[0]['Numero de Contrato']
        FilaAgregar["Nombres y Apellidos"] = ContratoPos.iloc[0]['Nombres y Apellidos']
        FilaAgregar["Numero de Identificación"] = ContratoPos.iloc[0]['Numero de Identificación']
        FilaAgregar["Centro de Costo"] = ContratoPos.iloc[0]['Centro de Costo']
        
        if(ContratoPos.iloc[0]['Dependencia']):
            FilaAgregar["Dependencia"] = ContratoPos.iloc[0]['Dependencia']
        if(ContratoPos.iloc[0]['Proceso']):
            FilaAgregar["Proceso"] = ContratoPos.iloc[0]['Proceso']
        # if(ContratoPos.iloc[0]['Area']):
        #     FilaAgregar["Area"] = ContratoPos.iloc[0]['Area']
        # if(ContratoPos.iloc[0]['Nivel']):
        #     FilaAgregar["Nivel"] = ContratoPos.iloc[0]['Nivel']
        FilaAgregar["Fecha Ingreso"] = pd.to_datetime(ContratoPos.iloc[0]['Fecha Ingreso']).date()
        FilaAgregar["Fecha Retiro"] = pd.to_datetime(ContratoPos.iloc[0]['Fecha Retiro']).date()
        FilaAgregar["Cargo"] = ContratoPos.iloc[0]['Cargo']
        FilaAgregar["Salario Base"] = ContratoPos.iloc[0]['Salario Base']
        SumatoriaNetoDev = 0
        SumatoriaNetoDed = 0
        #Ciclo para tomar informacion de los conceptos
        for elemento in ConceptosDev:
            de = ContratoPos["Concepto"] == str(elemento)
            Conce= ContratoPos[de]
            Unidades = 0
            Neto = 0
            if (Conce.empty == False):
                # print(Conce)
                # print(elemento + " / Unidades")
                Unidades = Conce["Horas"].sum()
                Neto = Conce["Neto"].sum()
                SumatoriaNetoDev += Neto
            if (elemento + " / Neto" in FilaAgregar):
                FilaAgregar[elemento + " / Unidades"] += Unidades
                FilaAgregar[elemento + " / Neto"] += Neto 
            else:
                FilaAgregar[elemento + " / Unidades"] = Unidades
                FilaAgregar[elemento + " / Neto"] = Neto 
        FilaAgregar["Total Devengo"] = SumatoriaNetoDev
        for elemento in ConceptosDed:
            de = ContratoPos["Concepto"] == str(elemento)
            Conce= ContratoPos[de]
            Unidades = 0
            Neto = 0
            if (Conce.empty == False):
                # print(Conce)
                # print(elemento + " / Unidades")
                Unidades = Conce["Horas"].sum()
                Neto = Conce["Neto"].sum()
                SumatoriaNetoDed += Neto
            if (elemento + " / Neto" in FilaAgregar):
                FilaAgregar[elemento + " / Unidades"] += Unidades
                FilaAgregar[elemento + " / Neto"] += Neto 
            else:
                FilaAgregar[elemento + " / Unidades"] = Unidades
                FilaAgregar[elemento + " / Neto"] = Neto 
        FilaAgregar["Total Deduccion"] = SumatoriaNetoDed
        FilaAgregar["Neto A Pagar"] = SumatoriaNetoDev - abs(SumatoriaNetoDed)
        # Informacion general de provisiones y SS 
        FilaAgregar["EPS"] = ContratoPos.iloc[0]['EPS']
        FilaAgregar["AFP"] = ContratoPos.iloc[0]['AFP']
        FilaAgregar["ARL"] = ContratoPos.iloc[0]['ARL']
        FilaAgregar["Riesgo ARL"] = ContratoPos.iloc[0]['Riesgo ARL']
        FilaAgregar["CCF"] = ContratoPos.iloc[0]['CCF']
        FilaAgregar["SENA"] = ContratoPos.iloc[0]['SENA']
        FilaAgregar["ICBF"] = ContratoPos.iloc[0]['ICBF']
        FilaAgregar["Total Seguridad Social"] = ContratoPos.iloc[0]['EPS'] + ContratoPos.iloc[0]['AFP'] + ContratoPos.iloc[0]['ARL'] + ContratoPos.iloc[0]['CCF'] + ContratoPos.iloc[0]['SENA'] + ContratoPos.iloc[0]['ICBF']
        FilaAgregar["Vacaciones tiempo"] = ContratoPos.iloc[0]['Vacaciones tiempo']
        FilaAgregar["Prima"] = ContratoPos.iloc[0]['Prima']
        FilaAgregar["Cesantías"] = ContratoPos.iloc[0]['Cesantías']
        FilaAgregar["Interés cesantías"] = ContratoPos.iloc[0]['Interés cesantías']
        FilaAgregar["Total provisiones"] = ContratoPos.iloc[0]['Vacaciones tiempo'] + ContratoPos.iloc[0]['Prima'] + ContratoPos.iloc[0]['Cesantías'] + ContratoPos.iloc[0]['Interés cesantías']
        
        Horizontal = Horizontal.append(FilaAgregar, ignore_index=True)
    NombreDocumento = "Horizontal " + Horizontal.iloc[0]['Empresa'] +"-"+ str(Horizontal.iloc[0]['Mes'])+ "-" + str(Horizontal.iloc[0]['Tipo de Perido'])
    
    heads = Horizontal.columns.values
    FilaAgregar = {}
    Validador = False
    # Horizontal.count(1)
    for k in heads:
        if(str(k).__contains__("Salario Base")):
            Validador = True
        if(Validador):
            Horizontal[k] = Horizontal[k].astype('float')
            FilaAgregar[k] = sum(Horizontal[k])
        
    Horizontal = Horizontal.append(FilaAgregar, ignore_index=True)

    wb = Workbook()
    ws = wb.active
    for r in dataframe_to_rows(Horizontal, index=False, header=True):
        ws.append(r)

    ws.insert_rows(1)
    ws.insert_rows(1)
    ws.insert_rows(1)
    Horizontal = pd.DataFrame(ws.values)
    with BytesIO() as b:
        # Use the StringIO object as the filehandle.
        writer = pd.ExcelWriter(b, engine='xlsxwriter')
        Horizontal.to_excel(writer, sheet_name='Sheet1',index = False, header = False)
        # Horizontal.to_excel(writer, sheet_name='Sheet1',index = False, header = False)
        # Edicion del estilo del excel
        workbook = writer.book
        worksheet = writer.sheets["Sheet1"]
        format = workbook.add_format()
        format.set_pattern(1)
        format.set_bg_color('#AFAFAF')
        format.set_bold(True) 
        
        worksheet.write_string(1, 1,str(ContratoPos.iloc[0]['Temporal']),format)
        worksheet.write_string(1, 2,str(ContratoPos.iloc[0]['Empresa']),format)
        worksheet.write_string(1, 3,str(ContratoPos.iloc[0]['ID Periodo']),format)
        worksheet.write_string(1, 4,str(ContratoPos.iloc[0]['Mes']),format)
        worksheet.write_string(1, 5,str(ContratoPos.iloc[0]['Tipo de Perido']),format)
        worksheet.write_string(1, 1,str(ContratoPos.iloc[0]['Temporal']),format)
        worksheet.write_string(1, 2,str(ContratoPos.iloc[0]['Empresa']),format)
        worksheet.write_string(1, 3,str(ContratoPos.iloc[0]['ID Periodo']),format)
        worksheet.write_string(1, 4,str(ContratoPos.iloc[0]['Mes']),format)
        worksheet.write_string(1, 5,str(ContratoPos.iloc[0]['Tipo de Perido']),format)
        
        contador = 0
        MaxFilas = len(Horizontal.axes[0])
        Totales = Horizontal.loc[MaxFilas -1]
        for k in heads:
            
            worksheet.write_string(3, contador,str(k),format)
            contador += 1
            
        contador = 0
        for k in Totales:
            Dato = ""
            if(str(k) != "nan"):
                Dato = str(k)
            worksheet.write_string(MaxFilas-1, contador,Dato ,format)
            contador += 1
        ##Modificar el excel
        writer.save()
        # Set up the Http response.
        filename = NombreDocumento+'.xlsx'
        response = HttpResponse(
            b.getvalue(),
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename=%s' % filename
        return response
    return render(request, "Resultado.html")

procesar()