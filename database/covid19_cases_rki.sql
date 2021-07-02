create table covid19_cases_rki (
	zeit_abgerufen timestamp,
	zeit_datenstand timestamp,
	bundesland varchar(30),
	anzahl int,
	differenz_zum_vortag int,
	faelle_letzte_7_tage int,
	_7_tage_inzidenz float,
	todesfaelle int,
	
	zeit_datenstand_raw varchar(50),
	anzahl_raw varchar(30),
	differenz_zum_vortag_raw varchar(20),
	faelle_letzte_7_tage_raw varchar(20),
	_7_tage_inzidenz_raw varchar(20),
	todesfaelle_raw varchar(20),

	html_raw longtext,
	
	primary key (bundesland, zeit_abgerufen)
	
);
