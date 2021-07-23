create table covid19_vaccinations_germany_by_state (

	time_crawled timestamp,
	code varchar(30),
	vaccinationsTotal int,
	peopleFirstTotal int,
	peopleFullTotal int,
	percent_fully_vaccinated float,
	
	
	primary key (time_crawled, code)
);