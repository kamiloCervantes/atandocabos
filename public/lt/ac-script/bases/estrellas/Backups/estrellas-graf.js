

			 
			//////////////////////// Configuración ////////////////////////////// 
			
			var margin = {top: 30, right: 30, bottom: 30, left: 30},
				width = 200,
				height = 200;
				/*width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
				height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);	*/
			
			////////////////////////// Datos ////////////////////////////// 
			
			//Datos consolidados
			var data_gen1 = [[//Gráfica general 1
						{axis:"De acuerdo",value:0.2},
						{axis:"Completamente de acuerdo",value:0.2},
						{axis:"En desacuerdo",value:0.05},
						{axis:"Completamente en desacuerdo",value:0.35},
						{axis:"Le es indiferente",value:0.2}
									
					  ]];
			var data_gen2 = [[//Gráfica general 2
						{axis:"De acuerdo",value:0.2},
						{axis:"Completamente de acuerdo",value:0.2},
						{axis:"En desacuerdo",value:0.75},
						{axis:"Completamente en desacuerdo",value:0.35},
						{axis:"Le es indiferente",value:0.2}
									
					  ]];
			var data_gen3 = [[//Gráfica general 3
						{axis:"De acuerdo",value:0.25},
						{axis:"Completamente de acuerdo",value:0.24},
						{axis:"En desacuerdo",value:0.05},
						{axis:"Completamente en desacuerdo",value:0.35},
						{axis:"Le es indiferente",value:0.2}
									
					  ]];
			//Datos segregados por sexo		  
			var data_sex1 = [[//Gráfica sexo 1 hombres
						{axis:"De acuerdo",value:0.2},
						{axis:"Completamente de acuerdo",value:0.2},
						{axis:"En desacuerdo",value:0.05},
						{axis:"Completamente en desacuerdo",value:0.35},
						{axis:"Le es indiferente",value:0.2}
									
					  ],
					  [//Gráfica sexo 1 mujeres
						{axis:"De acuerdo",value:0.25},
						{axis:"Completamente de acuerdo",value:0.1},
						{axis:"En desacuerdo",value:0.55},
						{axis:"Completamente en desacuerdo",value:0.35},
						{axis:"Le es indiferente",value:0.28}
									
					  ]];
			var data_sex2 = [[//Gráfica sexo 2 hombres
						{axis:"De acuerdo",value:0.2},
						{axis:"Completamente de acuerdo",value:0.2},
						{axis:"En desacuerdo",value:0.05},
						{axis:"Completamente en desacuerdo",value:0.35},
						{axis:"Le es indiferente",value:0.2}
									
					  ],
					  [//Gráfica sexo 2 mujeres
						{axis:"De acuerdo",value:0.25},
						{axis:"Completamente de acuerdo",value:0.1},
						{axis:"En desacuerdo",value:0.55},
						{axis:"Completamente en desacuerdo",value:0.35},
						{axis:"Le es indiferente",value:0.28}
									
					  ]];
			var data_sex3 = [[//Gráfica sexo 3 hombres
						{axis:"De acuerdo",value:0.2},
						{axis:"Completamente de acuerdo",value:0.2},
						{axis:"En desacuerdo",value:0.05},
						{axis:"Completamente en desacuerdo",value:0.35},
						{axis:"Le es indiferente",value:0.2}
									
					  ],
					  [//Gráfica sexo 3 mujeres
						{axis:"De acuerdo",value:0.25},
						{axis:"Completamente de acuerdo",value:0.1},
						{axis:"En desacuerdo",value:0.55},
						{axis:"Completamente en desacuerdo",value:0.35},
						{axis:"Le es indiferente",value:0.28}
									
					  ]];
			//Datos desagregados por edad
			
			//Grupo de edad 1
			var data_edad1_1 = [[//Gráfica Edad 1.1
						{axis:"De acuerdo",value:0.2},
						{axis:"Completamente de acuerdo",value:0.2},
						{axis:"En desacuerdo",value:0.05},
						{axis:"Completamente en desacuerdo",value:0.35},
						{axis:"Le es indiferente",value:0.2}
									
					  ]];
			var data_edad1_2 = [[//Gráfica Edad 1.2
						{axis:"De acuerdo",value:0.2},
						{axis:"Completamente de acuerdo",value:0.2},
						{axis:"En desacuerdo",value:0.75},
						{axis:"Completamente en desacuerdo",value:0.35},
						{axis:"Le es indiferente",value:0.2}
									
					  ]];
			var data_edad1_3 = [[//Gráfica Edad 1.3
						{axis:"De acuerdo",value:0.25},
						{axis:"Completamente de acuerdo",value:0.24},
						{axis:"En desacuerdo",value:0.05},
						{axis:"Completamente en desacuerdo",value:0.35},
						{axis:"Le es indiferente",value:0.2}
									
					  ]];	
			//Grupo de edad 2
			var data_edad2_1 = [[//Gráfica Edad 2.1
						{axis:"De acuerdo",value:0.2},
						{axis:"Completamente de acuerdo",value:0.2},
						{axis:"En desacuerdo",value:0.05},
						{axis:"Completamente en desacuerdo",value:0.35},
						{axis:"Le es indiferente",value:0.2}
									
					  ]];
			var data_edad2_2 = [[//Gráfica Edad 2.2
						{axis:"De acuerdo",value:0.2},
						{axis:"Completamente de acuerdo",value:0.2},
						{axis:"En desacuerdo",value:0.75},
						{axis:"Completamente en desacuerdo",value:0.35},
						{axis:"Le es indiferente",value:0.2}
									
					  ]];
			var data_edad2_3 = [[//Gráfica Edad 2.3
						{axis:"De acuerdo",value:0.25},
						{axis:"Completamente de acuerdo",value:0.24},
						{axis:"En desacuerdo",value:0.05},
						{axis:"Completamente en desacuerdo",value:0.35},
						{axis:"Le es indiferente",value:0.2}
									
					  ]];
			//Grupo de edad 3
			var data_edad3_1 = [[//Gráfica Edad 3.1
						{axis:"De acuerdo",value:0.2},
						{axis:"Completamente de acuerdo",value:0.2},
						{axis:"En desacuerdo",value:0.05},
						{axis:"Completamente en desacuerdo",value:0.35},
						{axis:"Le es indiferente",value:0.2}
									
					  ]];
			var data_edad3_2 = [[//Gráfica Edad 3.2
						{axis:"De acuerdo",value:0.2},
						{axis:"Completamente de acuerdo",value:0.2},
						{axis:"En desacuerdo",value:0.75},
						{axis:"Completamente en desacuerdo",value:0.35},
						{axis:"Le es indiferente",value:0.2}
									
					  ]];
			var data_edad3_3 = [[//Gráfica Edad 3.3
						{axis:"De acuerdo",value:0.25},
						{axis:"Completamente de acuerdo",value:0.24},
						{axis:"En desacuerdo",value:0.05},
						{axis:"Completamente en desacuerdo",value:0.35},
						{axis:"Le es indiferente",value:0.2}
									
					  ]];
			//Grupo de edad 4
			var data_edad4_1 = [[//Gráfica Edad 4.1
						{axis:"De acuerdo",value:0.2},
						{axis:"Completamente de acuerdo",value:0.2},
						{axis:"En desacuerdo",value:0.05},
						{axis:"Completamente en desacuerdo",value:0.35},
						{axis:"Le es indiferente",value:0.2}
									
					  ]];
			var data_edad4_2 = [[//Gráfica Edad 4.2
						{axis:"De acuerdo",value:0.2},
						{axis:"Completamente de acuerdo",value:0.2},
						{axis:"En desacuerdo",value:0.75},
						{axis:"Completamente en desacuerdo",value:0.35},
						{axis:"Le es indiferente",value:0.2}
									
					  ]];
			var data_edad4_3 = [[//Gráfica Edad 4.3
						{axis:"De acuerdo",value:0.25},
						{axis:"Completamente de acuerdo",value:0.24},
						{axis:"En desacuerdo",value:0.05},
						{axis:"Completamente en desacuerdo",value:0.35},
						{axis:"Le es indiferente",value:0.2}
									
					  ]];
			//Grupo de edad 5
			var data_edad5_1 = [[//Gráfica Edad 5.1
						{axis:"De acuerdo",value:0.2},
						{axis:"Completamente de acuerdo",value:0.2},
						{axis:"En desacuerdo",value:0.05},
						{axis:"Completamente en desacuerdo",value:0.35},
						{axis:"Le es indiferente",value:0.2}
									
					  ]];
			var data_edad5_2 = [[//Gráfica Edad 5.2
						{axis:"De acuerdo",value:0.2},
						{axis:"Completamente de acuerdo",value:0.2},
						{axis:"En desacuerdo",value:0.75},
						{axis:"Completamente en desacuerdo",value:0.35},
						{axis:"Le es indiferente",value:0.2}
									
					  ]];
			var data_edad5_3 = [[//Gráfica Edad 5.3
						{axis:"De acuerdo",value:0.25},
						{axis:"Completamente de acuerdo",value:0.24},
						{axis:"En desacuerdo",value:0.05},
						{axis:"Completamente en desacuerdo",value:0.35},
						{axis:"Le es indiferente",value:0.2}
									
					  ]];
			//Grupo de edad 6
			var data_edad6_1 = [[//Gráfica Edad 6.1
						{axis:"De acuerdo",value:0.2},
						{axis:"Completamente de acuerdo",value:0.2},
						{axis:"En desacuerdo",value:0.05},
						{axis:"Completamente en desacuerdo",value:0.35},
						{axis:"Le es indiferente",value:0.2}
									
					  ]];
			var data_edad6_2 = [[//Gráfica Edad 6.2
						{axis:"De acuerdo",value:0.2},
						{axis:"Completamente de acuerdo",value:0.2},
						{axis:"En desacuerdo",value:0.75},
						{axis:"Completamente en desacuerdo",value:0.35},
						{axis:"Le es indiferente",value:0.2}
									
					  ]];
			var data_edad6_3 = [[//Gráfica Edad 6.3
						{axis:"De acuerdo",value:0.25},
						{axis:"Completamente de acuerdo",value:0.24},
						{axis:"En desacuerdo",value:0.05},
						{axis:"Completamente en desacuerdo",value:0.35},
						{axis:"Le es indiferente",value:0.2}
									
					  ]];	  		  
			//////////////////// Generar gráfica ////////////////////////// 
			var color = d3.scale.ordinal()
				.range(["#00A0B0","#EDC951","#CC333F"]);
				
			var radarChartOptions = {
			  w: width,
			  h: height,
			  margin: margin,
			  maxValue: 1,  //Escala porcentajes ej: 0.5 = 50%
			  levels: 5, //Número de círculos de porcentajes
			  roundStrokes: true, //Redondear líneas
			  color: color
			};
			//Call function to draw the Radar chart
			RadarChart("#lt-1-gen-1", data_gen1, radarChartOptions);
			RadarChart("#lt-1-gen-2", data_gen2, radarChartOptions);
			RadarChart("#lt-1-gen-3", data_gen3, radarChartOptions);
			
			RadarChart("#lt-1-sex-1", data_sex1, radarChartOptions);
			RadarChart("#lt-1-sex-2", data_sex2, radarChartOptions);
			RadarChart("#lt-1-sex-3", data_sex3, radarChartOptions);
			
			RadarChart("#lt-1-edad-1-1", data_edad1_1, radarChartOptions);
			RadarChart("#lt-1-edad-1-2", data_edad1_2, radarChartOptions);
			RadarChart("#lt-1-edad-1-3", data_edad1_3, radarChartOptions);
			
			RadarChart("#lt-1-edad-2-1", data_edad2_1, radarChartOptions);
			RadarChart("#lt-1-edad-2-2", data_edad2_2, radarChartOptions);
			RadarChart("#lt-1-edad-2-3", data_edad2_3, radarChartOptions);
			
			RadarChart("#lt-1-edad-3-1", data_edad3_1, radarChartOptions);
			RadarChart("#lt-1-edad-3-2", data_edad3_2, radarChartOptions);
			RadarChart("#lt-1-edad-3-3", data_edad3_3, radarChartOptions);
			
			RadarChart("#lt-1-edad-4-1", data_edad4_1, radarChartOptions);
			RadarChart("#lt-1-edad-4-2", data_edad4_2, radarChartOptions);
			RadarChart("#lt-1-edad-4-3", data_edad4_3, radarChartOptions);
			
			RadarChart("#lt-1-edad-5-1", data_edad5_1, radarChartOptions);
			RadarChart("#lt-1-edad-5-2", data_edad5_2, radarChartOptions);
			RadarChart("#lt-1-edad-5-3", data_edad5_3, radarChartOptions);
			
			RadarChart("#lt-1-edad-6-1", data_edad6_1, radarChartOptions);
			RadarChart("#lt-1-edad-6-2", data_edad6_2, radarChartOptions);
			RadarChart("#lt-1-edad-6-3", data_edad6_3, radarChartOptions);
			
		