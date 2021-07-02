


create table covid19_cases_google (
	time_crawled timestamp not null,
	country varchar(50) not null,
	cases_total int,
	cases_today int,
	recovered_total int,
	recovered_today int,
	deaths_total int,
	deaths_today int,
	
	cases_total_raw varchar(30),
	cases_today_raw varchar(30),
	recovered_total_raw varchar(30),
	recovered_today_raw varchar(30),
	deaths_total_raw varchar(30),
	deaths_today_raw varchar(30),
	
	html_raw longtext,
	
	primary key (country, time_crawled)
	
);
