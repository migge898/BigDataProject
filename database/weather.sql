

create table weather (
	
	id int NOT NULL AUTO_INCREMENT,
	
	country varchar(30) not null,
	region varchar(30),
	time_crawled timestamp not null DEFAULT CURRENT_TIMESTAMP,
	city varchar(30),
	temperature float,
	temperature_raw varchar(30),
	
	weather varchar(50),
	
	html_raw longtext,
	
	primary key( id )
	
);

