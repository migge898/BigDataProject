

create table covid19_vaccinations_google (

	time_crawled timestamp,
	country varchar(30),
	doses_given int,
	fully_vaccinated int,
	percent_fully_vaccinated float,
	
	doses_given_raw varchar(30),
	fully_vaccinated_raw varchar(30),
	percent_fully_vaccinated_raw varchar(30),
	
	html_raw longtext,
	
	primary key (time_crawled, country)
);
