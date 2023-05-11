create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Set up Storage!
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

insert into storage.buckets (id, name, public)
  values ('images', 'images', true);

-- insert empty folder spots into images bucket
insert into storage.objects (bucket_id, name)
  values ('images', 'spots/.emptyFolderPlaceholder');

comment on table countries is 'Full list of countries.';

comment on column countries.name is 'Full country name.';

comment on column countries.iso2 is 'ISO 3166-1 alpha-2 code.';

comment on column countries.iso3 is 'ISO 3166-1 alpha-3 code.';

comment on column countries.local_name is 'Local variation of the name.';

insert into
    public.countries (name, iso2, iso3, local_name, continent)
values
    (
        'Bonaire, Sint Eustatius and Saba',
        'BQ',
        'BES',
        null,
        null
    ),
    ('Curaçao', 'CW', 'CUW', null, null),
    ('Guernsey', 'GG', 'GGY', null, null),
    ('Isle of Man', 'IM', 'IMN', null, null),
    ('Jersey', 'JE', 'JEY', null, null),
    ('Åland Islands', 'AX', 'ALA', null, null),
    ('Montenegro', 'ME', 'MNE', null, null),
    ('Saint Barthélemy', 'BL', 'BLM', null, null),
    (
        'Saint Martin (French part)',
        'MF',
        'MAF',
        null,
        null
    ),
    ('Serbia', 'RS', 'SRB', null, null),
    ('Sint Maarten (Dutch part)', 'SX', 'SXM', null, null),
    ('South Sudan', 'SS', 'SSD', null, null),
    ('Timor-Leste', 'TL', 'TLS', null, null),
    (
        'American Samoa',
        'as',
        'ASM',
        'Amerika Samoa',
        'Oceania'
    ),
    ('Andorra', 'AD', 'AND', 'Andorra', 'Europe'),
    ('Angola', 'AO', 'AGO', 'Angola', 'Africa'),
    ('Anguilla', 'AI', 'AIA', 'Anguilla', 'North America'),
    ('Antarctica', 'AQ', 'ATA', '', 'Antarctica'),
    (
        'Antigua and Barbuda',
        'AG',
        'ATG',
        'Antigua and Barbuda',
        'North America'
    ),
    (
        'Argentina',
        'AR',
        'ARG',
        'Argentina',
        'South America'
    ),
    ('Armenia', 'AM', 'ARM', 'Hajastan', 'Asia'),
    ('Aruba', 'AW', 'ABW', 'Aruba', 'North America'),
    ('Australia', 'AU', 'AUS', 'Australia', 'Oceania'),
    ('Austria', 'AT', 'AUT', 'Österreich', 'Europe'),
    ('Azerbaijan', 'AZ', 'AZE', 'Azerbaijan', 'Asia'),
    (
        'Bahamas',
        'BS',
        'BHS',
        'The Bahamas',
        'North America'
    ),
    ('Bahrain', 'BH', 'BHR', 'Al-Bahrayn', 'Asia'),
    ('Bangladesh', 'BD', 'BGD', 'Bangladesh', 'Asia'),
    ('Barbados', 'BB', 'BRB', 'Barbados', 'North America'),
    ('Belarus', 'BY', 'BLR', 'Belarus', 'Europe'),
    ('Belgium', 'BE', 'BEL', 'Belgium/Belgique', 'Europe'),
    ('Belize', 'BZ', 'BLZ', 'Belize', 'North America'),
    ('Benin', 'BJ', 'BEN', 'Benin', 'Africa'),
    ('Bermuda', 'BM', 'BMU', 'Bermuda', 'North America'),
    ('Bhutan', 'BT', 'BTN', 'Druk-Yul', 'Asia'),
    ('Bolivia', 'BO', 'BOL', 'Bolivia', 'South America'),
    (
        'Bosnia and Herzegovina',
        'BA',
        'BIH',
        'Bosna i Hercegovina',
        'Europe'
    ),
    ('Botswana', 'BW', 'BWA', 'Botswana', 'Africa'),
    (
        'Bouvet Island',
        'BV',
        'BVT',
        'Bouvet Island',
        'Antarctica'
    ),
    ('Brazil', 'BR', 'BRA', 'Brasil', 'South America'),
    (
        'British Indian Ocean Territory',
        'IO',
        'IOT',
        'British Indian Ocean Territory',
        'Africa'
    ),
    (
        'Brunei Darussalam',
        'BN',
        'BRN',
        'Brunei Darussalam',
        'Asia'
    ),
    ('Bulgaria', 'BG', 'BGR', 'Balgarija', 'Europe'),
    (
        'Burkina Faso',
        'BF',
        'BFA',
        'Burkina Faso',
        'Africa'
    ),
    ('Burundi', 'BI', 'BDI', 'Burundi/Uburundi', 'Africa'),
    ('Cambodia', 'KH', 'KHM', 'Cambodia', 'Asia'),
    (
        'Cameroon',
        'CM',
        'CMR',
        'Cameroun/Cameroon',
        'Africa'
    ),
    ('Canada', 'CA', 'CAN', 'Canada', 'North America'),
    ('Cape Verde', 'CV', 'CPV', 'Cabo Verde', 'Africa'),
    (
        'Cayman Islands',
        'KY',
        'CYM',
        'Cayman Islands',
        'North America'
    ),
    (
        'Central African Republic',
        'CF',
        'CAF',
        'Centrafrique',
        'Africa'
    ),
    ('Chad', 'TD', 'TCD', 'Tchad/Tshad', 'Africa'),
    ('Chile', 'CL', 'CHL', 'Chile', 'South America'),
    ('China', 'CN', 'CHN', 'Zhongquo', 'Asia'),
    (
        'Christmas Island',
        'CX',
        'CXR',
        'Christmas Island',
        'Oceania'
    ),
    (
        'Cocos (Keeling) Islands',
        'CC',
        'CCK',
        'Cocos (Keeling) Islands',
        'Oceania'
    ),
    ('Colombia', 'CO', 'COL', 'Colombia', 'South America'),
    ('Comoros', 'KM', 'COM', 'Komori/Comores', 'Africa'),
    ('Congo', 'CG', 'COG', 'Congo', 'Africa'),
    (
        'Congo, the Democratic Republic of the',
        'CD',
        'COD',
        'Republique Democratique du Congo',
        'Africa'
    ),
    (
        'Cook Islands',
        'CK',
        'COK',
        'The Cook Islands',
        'Oceania'
    ),
    (
        'Costa Rica',
        'CR',
        'CRI',
        'Costa Rica',
        'North America'
    ),
    (
        'Cote DIvoire',
        'CI',
        'CIV',
        'Côte dIvoire',
        'Africa'
    ),
    ('Croatia', 'HR', 'HRV', 'Hrvatska', 'Europe'),
    ('Cuba', 'CU', 'CUB', 'Cuba', 'North America'),
    ('Cyprus', 'CY', 'CYP', 'Cyprus', 'Asia'),
    ('Czech Republic', 'CZ', 'CZE', 'Czech', 'Europe'),
    ('Denmark', 'DK', 'DNK', 'Danmark', 'Europe'),
    ('Djibouti', 'DJ', 'DJI', 'Djibouti/Jibuti', 'Africa'),
    ('Dominica', 'DM', 'DMA', 'Dominica', 'North America'),
    (
        'Dominican Republic',
        'DO',
        'DOM',
        'Republica Dominicana',
        'North America'
    ),
    ('Ecuador', 'EC', 'ECU', 'Ecuador', 'South America'),
    ('Egypt', 'EG', 'EGY', 'Misr', 'Africa'),
    (
        'El Salvador',
        'SV',
        'SLV',
        'El Salvador',
        'North America'
    ),
    (
        'Equatorial Guinea',
        'GQ',
        'GNQ',
        'Guinea Ecuatorial',
        'Africa'
    ),
    ('Eritrea', 'ER', 'ERI', 'Ertra', 'Africa'),
    ('Estonia', 'EE', 'EST', 'Eesti', 'Europe'),
    ('Ethiopia', 'ET', 'ETH', 'Yeityopiya', 'Africa'),
    (
        'Falkland Islands (Malvinas)',
        'FK',
        'FLK',
        'Falkland Islands',
        'South America'
    ),
    (
        'Faroe Islands',
        'FO',
        'FRO',
        'Faroe Islands',
        'Europe'
    ),
    ('Fiji', 'FJ', 'FJI', 'Fiji Islands', 'Oceania'),
    ('Finland', 'FI', 'FIN', 'Suomi', 'Europe'),
    ('France', 'FR', 'FRA', 'France', 'Europe'),
    (
        'French Guiana',
        'GF',
        'GUF',
        'Guyane francaise',
        'South America'
    ),
    (
        'French Polynesia',
        'PF',
        'PYF',
        'Polynésie française',
        'Oceania'
    ),
    (
        'French Southern Territories',
        'TF',
        'ATF',
        'Terres australes françaises',
        'Antarctica'
    ),
    ('Gabon', 'GA', 'GAB', 'Le Gabon', 'Africa'),
    ('Gambia', 'GM', 'GMB', 'The Gambia', 'Africa'),
    ('Georgia', 'GE', 'GEO', 'Sakartvelo', 'Asia'),
    ('Germany', 'DE', 'DEU', 'Deutschland', 'Europe'),
    ('Ghana', 'GH', 'GHA', 'Ghana', 'Africa'),
    ('Gibraltar', 'GI', 'GIB', 'Gibraltar', 'Europe'),
    ('Greece', 'GR', 'GRC', 'Greece', 'Europe'),
    (
        'Greenland',
        'GL',
        'GRL',
        'Kalaallit Nunaat',
        'North America'
    ),
    ('Grenada', 'GD', 'GRD', 'Grenada', 'North America'),
    (
        'Guadeloupe',
        'GP',
        'GLP',
        'Guadeloupe',
        'North America'
    ),
    ('Guam', 'GU', 'GUM', 'Guam', 'Oceania'),
    (
        'Guatemala',
        'GT',
        'GTM',
        'Guatemala',
        'North America'
    ),
    ('Guinea', 'GN', 'GIN', 'Guinea', 'Africa'),
    (
        'Guinea-Bissau',
        'GW',
        'GNB',
        'Guinea-Bissau',
        'Africa'
    ),
    ('Guyana', 'GY', 'GUY', 'Guyana', 'South America'),
    ('Haiti', 'HT', 'HTI', 'Haiti/Dayti', 'North America'),
    (
        'Heard Island and Mcdonald Islands',
        'HM',
        'HMD',
        'Heard and McDonald Islands',
        'Antarctica'
    ),
    (
        'Holy See (Vatican City State)',
        'VA',
        'VAT',
        'Santa Sede/Città del Vaticano',
        'Europe'
    ),
    ('Honduras', 'HN', 'HND', 'Honduras', 'North America'),
    (
        'Hong Kong',
        'HK',
        'HKG',
        'Xianggang/Hong Kong',
        'Asia'
    ),
    ('Hungary', 'HU', 'HUN', 'Hungary', 'Europe'),
    ('Iceland', 'IS', 'ISL', 'Iceland', 'Europe'),
    ('India', 'IN', 'IND', 'Bharat/India', 'Asia'),
    ('Indonesia', 'ID', 'IDN', 'Indonesia', 'Asia'),
    (
        'Iran, Islamic Republic of',
        'IR',
        'IRN',
        'Iran',
        'Asia'
    ),
    ('Iraq', 'IQ', 'IRQ', 'Al-Irāq', 'Asia'),
    ('Ireland', 'IE', 'IRL', 'Ireland', 'Europe'),
    ('Israel', 'IL', 'ISR', 'Yisrael', 'Asia'),
    ('Italy', 'IT', 'ITA', 'Italia', 'Europe'),
    ('Jamaica', 'JM', 'JAM', 'Jamaica', 'North America'),
    ('Japan', 'JP', 'JPN', 'Nihon/Nippon', 'Asia'),
    ('Jordan', 'JO', 'JOR', 'Al-Urdunn', 'Asia'),
    ('Kazakhstan', 'KZ', 'KAZ', 'Qazaqstan', 'Asia'),
    ('Kenya', 'KE', 'KEN', 'Kenya', 'Africa'),
    ('Kiribati', 'KI', 'KIR', 'Kiribati', 'Oceania'),
    (
        'Korea, Democratic People''s Republic of',
        'KP',
        'PRK',
        'Choson Minjujuui Inmin Konghwaguk (Bukhan)',
        'Asia'
    ),
    (
        'Korea, Republic of',
        'KR',
        'KOR',
        'Taehan-minguk (Namhan)',
        'Asia'
    ),
    ('Kuwait', 'KW', 'KWT', 'Al-Kuwayt', 'Asia'),
    ('Kyrgyzstan', 'KG', 'KGZ', 'Kyrgyzstan', 'Asia'),
    (
        'Lao People''s Democratic Republic',
        'LA',
        'LAO',
        'Lao',
        'Asia'
    ),
    ('Latvia', 'LV', 'LVA', 'Latvija', 'Europe'),
    ('Lebanon', 'LB', 'LBN', 'Lubnan', 'Asia'),
    ('Lesotho', 'LS', 'LSO', 'Lesotho', 'Africa'),
    ('Liberia', 'LR', 'LBR', 'Liberia', 'Africa'),
    ('Libya', 'LY', 'LBY', 'Libiya', 'Africa'),
    (
        'Liechtenstein',
        'LI',
        'LIE',
        'Liechtenstein',
        'Europe'
    ),
    ('Lithuania', 'LT', 'LTU', 'Lietuva', 'Europe'),
    ('Luxembourg', 'LU', 'LUX', 'Luxembourg', 'Europe'),
    ('Macao', 'MO', 'MAC', 'Macau/Aomen', 'Asia'),
    (
        'Macedonia, the Former Yugoslav Republic of',
        'MK',
        'MKD',
        'Makedonija',
        'Europe'
    ),
    (
        'Madagascar',
        'MG',
        'MDG',
        'Madagasikara/Madagascar',
        'Africa'
    ),
    ('Malawi', 'MW', 'MWI', 'Malawi', 'Africa'),
    ('Malaysia', 'MY', 'MYS', 'Malaysia', 'Asia'),
    (
        'Maldives',
        'MV',
        'MDV',
        'Dhivehi Raajje/Maldives',
        'Asia'
    ),
    ('Mali', 'ML', 'MLI', 'Mali', 'Africa'),
    ('Malta', 'MT', 'MLT', 'Malta', 'Europe'),
    (
        'Marshall Islands',
        'MH',
        'MHL',
        'Marshall Islands/Majol',
        'Oceania'
    ),
    (
        'Martinique',
        'MQ',
        'MTQ',
        'Martinique',
        'North America'
    ),
    (
        'Mauritania',
        'MR',
        'MRT',
        'Muritaniya/Mauritanie',
        'Africa'
    ),
    ('Mauritius', 'MU', 'MUS', 'Mauritius', 'Africa'),
    ('Mayotte', 'YT', 'MYT', 'Mayotte', 'Africa'),
    ('Mexico', 'MX', 'MEX', 'Mexico', 'North America'),
    (
        'Micronesia, Federated States of',
        'FM',
        'FSM',
        'Micronesia',
        'Oceania'
    ),
    (
        'Moldova, Republic of',
        'MD',
        'MDA',
        'Moldova',
        'Europe'
    ),
    ('Monaco', 'MC', 'MCO', 'Monaco', 'Europe'),
    ('Mongolia', 'MN', 'MNG', 'Mongol Uls', 'Asia'),
    (
        'Albania',
        'AL',
        'ALB',
        'Republika e Shqipërisë',
        'Europe'
    ),
    (
        'Montserrat',
        'MS',
        'MSR',
        'Montserrat',
        'North America'
    ),
    ('Morocco', 'MA', 'MAR', 'Al-Maghrib', 'Africa'),
    ('Mozambique', 'MZ', 'MOZ', 'Mozambique', 'Africa'),
    ('Myanmar', 'MM', 'MMR', 'Myanma Pye', 'Asia'),
    ('Namibia', 'NA', 'NAM', 'Namibia', 'Africa'),
    ('Nauru', 'NR', 'NRU', 'Naoero/Nauru', 'Oceania'),
    ('Nepal', 'NP', 'NPL', 'Nepal', 'Asia'),
    ('Netherlands', 'NL', 'NLD', 'Nederland', 'Europe'),
    (
        'New Caledonia',
        'NC',
        'NCL',
        'Nouvelle-Calédonie',
        'Oceania'
    ),
    (
        'New Zealand',
        'NZ',
        'NZL',
        'New Zealand/Aotearoa',
        'Oceania'
    ),
    (
        'Nicaragua',
        'NI',
        'NIC',
        'Nicaragua',
        'North America'
    ),
    ('Niger', 'NE', 'NER', 'Niger', 'Africa'),
    ('Nigeria', 'NG', 'NGA', 'Nigeria', 'Africa'),
    ('Niue', 'NU', 'NIU', 'Niue', 'Oceania'),
    (
        'Norfolk Island',
        'NF',
        'NFK',
        'Norfolk Island',
        'Oceania'
    ),
    (
        'Northern Mariana Islands',
        'MP',
        'MNP',
        'Northern Mariana Islands',
        'Oceania'
    ),
    ('Norway', 'NO', 'NOR', 'Norge', 'Europe'),
    ('Oman', 'OM', 'OMN', 'Oman', 'Asia'),
    ('Pakistan', 'PK', 'PAK', 'Pakistan', 'Asia'),
    ('Palau', 'PW', 'PLW', 'Belau/Palau', 'Oceania'),
    (
        'Palestine, State of',
        'PS',
        'PSE',
        'Filastin',
        'Asia'
    ),
    (
        'Panama',
        'PA',
        'PAN',
        'República de Panamá',
        'North America'
    ),
    (
        'Papua New Guinea',
        'PG',
        'PNG',
        'Papua New Guinea/Papua Niugini',
        'Oceania'
    ),
    ('Paraguay', 'PY', 'PRY', 'Paraguay', 'South America'),
    ('Peru', 'PE', 'PER', 'Perú/Piruw', 'South America'),
    ('Philippines', 'PH', 'PHL', 'Pilipinas', 'Asia'),
    ('Pitcairn', 'PN', 'PCN', 'Pitcairn', 'Oceania'),
    ('Poland', 'PL', 'POL', 'Polska', 'Europe'),
    ('Portugal', 'PT', 'PRT', 'Portugal', 'Europe'),
    (
        'Puerto Rico',
        'PR',
        'PRI',
        'Puerto Rico',
        'North America'
    ),
    ('Qatar', 'QA', 'QAT', 'Qatar', 'Asia'),
    ('Reunion', 'RE', 'REU', 'Reunion', 'Africa'),
    ('Romania', 'RO', 'ROM', 'Romania', 'Europe'),
    (
        'Russian Federation',
        'RU',
        'RUS',
        'Rossija',
        'Europe'
    ),
    ('Rwanda', 'RW', 'RWA', 'Rwanda/Urwanda', 'Africa'),
    (
        'Saint Helena, Ascension and Tristan da Cunha',
        'SH',
        'SHN',
        'Saint Helena',
        'Africa'
    ),
    (
        'Saint Kitts and Nevis',
        'KN',
        'KNA',
        'Saint Kitts and Nevis',
        'North America'
    ),
    (
        'Saint Lucia',
        'LC',
        'LCA',
        'Saint Lucia',
        'North America'
    ),
    (
        'Saint Pierre and Miquelon',
        'PM',
        'SPM',
        'Saint-Pierre-et-Miquelon',
        'North America'
    ),
    (
        'Saint Vincent and the Grenadines',
        'VC',
        'VCT',
        'Saint Vincent and the Grenadines',
        'North America'
    ),
    ('Samoa', 'WS', 'WSM', 'Samoa', 'Oceania'),
    ('San Marino', 'SM', 'SMR', 'San Marino', 'Europe'),
    (
        'Sao Tome and Principe',
        'ST',
        'STP',
        'São Tomé e Príncipe',
        'Africa'
    ),
    (
        'Saudi Arabia',
        'SA',
        'SAU',
        'Al-Mamlaka al-Arabiya as-Saudiya',
        'Asia'
    ),
    (
        'Senegal',
        'SN',
        'SEN',
        'Sénégal/Sounougal',
        'Africa'
    ),
    (
        'Seychelles',
        'SC',
        'SYC',
        'Sesel/Seychelles',
        'Africa'
    ),
    (
        'Sierra Leone',
        'SL',
        'SLE',
        'Sierra Leone',
        'Africa'
    ),
    (
        'Singapore',
        'SG',
        'SGP',
        'Singapore/Singapura/Xinjiapo/Singapur',
        'Asia'
    ),
    ('Slovakia', 'SK', 'SVK', 'Slovensko', 'Europe'),
    ('Slovenia', 'SI', 'SVN', 'Slovenija', 'Europe'),
    (
        'Solomon Islands',
        'SB',
        'SLB',
        'Solomon Islands',
        'Oceania'
    ),
    ('Somalia', 'SO', 'SOM', 'Soomaaliya', 'Africa'),
    (
        'South Africa',
        'ZA',
        'ZAF',
        'South Africa',
        'Africa'
    ),
    (
        'South Georgia and the South Sandwich Islands',
        'GS',
        'SGS',
        'South Georgia and the South Sandwich Islands',
        'Antarctica'
    ),
    ('Spain', 'ES', 'ESP', 'España', 'Europe'),
    (
        'Sri Lanka',
        'LK',
        'LKA',
        'Sri Lanka/Ilankai',
        'Asia'
    ),
    ('Sudan', 'SD', 'SDN', 'As-Sudan', 'Africa'),
    ('Suriname', 'SR', 'SUR', 'Suriname', 'South America'),
    (
        'Svalbard and Jan Mayen',
        'SJ',
        'SJM',
        'Svalbard og Jan Mayen',
        'Europe'
    ),
    ('Swaziland', 'SZ', 'SWZ', 'kaNgwane', 'Africa'),
    ('Sweden', 'SE', 'SWE', 'Sverige', 'Europe'),
    (
        'Switzerland',
        'CH',
        'CHE',
        'Schweiz/Suisse/Svizzera/Svizra',
        'Europe'
    ),
    (
        'Syrian Arab Republic',
        'SY',
        'SYR',
        'Suriya',
        'Asia'
    ),
    (
        'Taiwan (Province of China)',
        'TW',
        'TWN',
        'Tai-wan',
        'Asia'
    ),
    ('Tajikistan', 'TJ', 'TJK', 'Tajikistan', 'Asia'),
    (
        'Tanzania, United Republic of',
        'TZ',
        'TZA',
        'Tanzania',
        'Africa'
    ),
    ('Thailand', 'TH', 'THA', 'Prathet Thai', 'Asia'),
    ('Togo', 'TG', 'TGO', 'Togo', 'Africa'),
    ('Tokelau', 'TK', 'TKL', 'Tokelau', 'Oceania'),
    ('Tonga', 'TO', 'TON', 'Tonga', 'Oceania'),
    (
        'Trinidad and Tobago',
        'TT',
        'TTO',
        'Trinidad and Tobago',
        'North America'
    ),
    ('Tunisia', 'TN', 'TUN', 'Tunis/Tunisie', 'Africa'),
    ('Turkey', 'TR', 'TUR', 'Türkiye', 'Asia'),
    ('Turkmenistan', 'TM', 'TKM', 'Türkmenistan', 'Asia'),
    (
        'Turks and Caicos Islands',
        'TC',
        'TCA',
        'The Turks and Caicos Islands',
        'North America'
    ),
    ('Tuvalu', 'TV', 'TUV', 'Tuvalu', 'Oceania'),
    ('Uganda', 'UG', 'UGA', 'Uganda', 'Africa'),
    ('Ukraine', 'UA', 'UKR', 'Ukrajina', 'Europe'),
    (
        'United Arab Emirates',
        'AE',
        'ARE',
        'Al-Amirat al-Arabiya al-Muttahida',
        'Asia'
    ),
    (
        'United Kingdom',
        'GB',
        'GBR',
        'United Kingdom',
        'Europe'
    ),
    (
        'United States',
        'US',
        'USA',
        'United States',
        'North America'
    ),
    (
        'United States Minor Outlying Islands',
        'UM',
        'UMI',
        'United States Minor Outlying Islands',
        'Oceania'
    ),
    ('Uruguay', 'UY', 'URY', 'Uruguay', 'South America'),
    ('Uzbekistan', 'UZ', 'UZB', 'Uzbekiston', 'Asia'),
    ('Vanuatu', 'VU', 'VUT', 'Vanuatu', 'Oceania'),
    (
        'Venezuela',
        'VE',
        'VEN',
        'Venezuela',
        'South America'
    ),
    ('Viet Nam', 'VN', 'VNM', 'Viet Nam', 'Asia'),
    (
        'Virgin Islands (British)',
        'VG',
        'VGB',
        'British Virgin Islands',
        'North America'
    ),
    (
        'Virgin Islands (U.S.)',
        'VI',
        'VIR',
        'Virgin Islands of the United States',
        'North America'
    ),
    (
        'Wallis and Futuna',
        'WF',
        'WLF',
        'Wallis-et-Futuna',
        'Oceania'
    ),
    (
        'Western Sahara',
        'EH',
        'ESH',
        'As-Sahrawiya',
        'Africa'
    ),
    ('Yemen', 'YE', 'YEM', 'Al-Yaman', 'Asia'),
    ('Zambia', 'ZM', 'ZMB', 'Zambia', 'Africa'),
    ('Zimbabwe', 'ZW', 'ZWE', 'Zimbabwe', 'Africa'),
    (
        'Afghanistan',
        'AF',
        'AFG',
        'Afganistan/Afqanestan',
        'Asia'
    ),
    (
        'Algeria',
        'DZ',
        'DZA',
        'Al-Jazair/Algerie',
        'Africa'
    );

INSERT INTO auth.users (instance_id,id,aud,"role",email,encrypted_password,email_confirmed_at,last_sign_in_at,raw_app_meta_data,raw_user_meta_data,is_super_admin,created_at,updated_at,phone,phone_confirmed_at,confirmation_token,email_change,email_change_token_new,recovery_token) VALUES
    ('00000000-0000-0000-0000-000000000000'::uuid,'9a51440b-313d-4a42-98df-3e5b14432793'::uuid,'authenticated','authenticated','admin@example.com', '$2y$10$Bl/azldgMoM.558KDS3clOcocyYeFBOYeXIh7APbmgFaeXIVUSXki', '2022-02-11 21:02:04.547','2022-02-11 22:53:12.520','{"provider": "email", "providers": ["email"]}','{}',FALSE,'2022-02-11 21:02:04.542','2022-02-11 21:02:04.542',NULL,NULL,'','','',''),
	('00000000-0000-0000-0000-000000000000'::uuid,'f76629c5-a070-4bbc-9918-64beaea48848'::uuid,'authenticated','authenticated','test@example.com','$2a$10$PznXR5VSgzjnAp7T/X7PCu6vtlgzdFt1zIr41IqP0CmVHQtShiXxS','2022-02-11 21:02:04.547','2022-02-11 22:53:12.520','{"provider": "email", "providers": ["email"]}','{}',FALSE,'2022-02-11 21:02:04.542','2022-02-11 21:02:04.542',NULL,NULL,'','','',''),
	('00000000-0000-0000-0000-000000000000'::uuid,'d9064bb5-1501-4ec9-bfee-21ab74d645b8'::uuid,'authenticated','authenticated','demo@example.com','$2a$10$mOJUAphJbZR4CdM38.bgOeyySurPeFHoH/T1s7HuGdpRb7JgatF7K','2022-02-12 07:40:23.616','2022-02-12 07:40:23.621','{"provider": "email", "providers": ["email"]}','{}',FALSE,'2022-02-12 07:40:23.612','2022-02-12 07:40:23.613',NULL,NULL,'','','','')
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id,user_id,identity_data,provider,last_sign_in_at,created_at,updated_at) VALUES
	('f76629c5-a070-4bbc-9918-64beaea48848','f76629c5-a070-4bbc-9918-64beaea48848'::uuid,'{"sub": "f76629c5-a070-4bbc-9918-64beaea48848"}','email','2022-02-11 21:02:04.545','2022-02-11 21:02:04.545','2022-02-11 21:02:04.545'),
	('d9064bb5-1501-4ec9-bfee-21ab74d645b8','d9064bb5-1501-4ec9-bfee-21ab74d645b8'::uuid,'{"sub": "d9064bb5-1501-4ec9-bfee-21ab74d645b8"}','email','2022-02-12 07:40:23.615','2022-02-12 07:40:23.615','2022-02-12 07:40:23.615'),
    ('9a51440b-313d-4a42-98df-3e5b14432793','9a51440b-313d-4a42-98df-3e5b14432793'::uuid,'{"sub": "9a51440b-313d-4a42-98df-3e5b14432793"}','email','2022-02-11 21:02:04.545','2022-02-11 21:02:04.545','2022-02-11 21:02:04.545')
ON CONFLICT (id, provider) DO NOTHING;

UPDATE profiles SET full_name = 'Admin', avatar_url = 'https://avatars.githubusercontent.com/u/10214025?v=4' WHERE id = '9a51440b-313d-4a42-98df-3e5b14432793';
UPDATE profiles SET full_name = 'Adam Ondra', username = 'adamondra', avatar_url = 'https://ifsc.results.info/athletes/1364/photo' WHERE id = 'd9064bb5-1501-4ec9-bfee-21ab74d645b8';
UPDATE profiles SET full_name = 'Stephano Ghisolfi', username = 'stephanoghisolfi', avatar_url = 'https://images.thenorthface.com/is/image/TheNorthFaceEU/ss22_stefano_ghisolfi_thumb?' WHERE id = 'f76629c5-a070-4bbc-9918-64beaea48848';

INSERT INTO friendships (first_user_id, second_user_id, creator_user_id, status) VALUES ('d9064bb5-1501-4ec9-bfee-21ab74d645b8', '9a51440b-313d-4a42-98df-3e5b14432793', '9a51440b-313d-4a42-98df-3e5b14432793', 'Accepted');
INSERT INTO friendships (first_user_id, second_user_id, creator_user_id, status) VALUES ('f76629c5-a070-4bbc-9918-64beaea48848', '9a51440b-313d-4a42-98df-3e5b14432793', '9a51440b-313d-4a42-98df-3e5b14432793', 'Accepted');

-- Insert spots 

WITH new_location AS (
        INSERT INTO locations (latitude, longitude, city, department, country)
        VALUES (43.8354, 3.30123, 'Saint Félix de l''Héras', 'Hérault', 83)
        RETURNING id
      )
      INSERT INTO spots (
        name, description, image, type, creator, difficulty, approach,
        period, orientation, rock_type, cliff_height, location
      )
      VALUES (
        'Saint Felix de l''héras/pas de l''escalette', NULL, '{}', 'Outdoor', '9a51440b-313d-4a42-98df-3e5b14432793', 'Medium', '',
        '{}', '{}', '', NULL, (SELECT id FROM new_location)
      );
    
      WITH new_location AS (
        INSERT INTO locations (latitude, longitude, city, department, country)
        VALUES (44.4373, 5.20379, 'Saint-Ferréol-Trente-Pas', 'Drôme', 83)
        RETURNING id
      )
      INSERT INTO spots (
        name, description, image, type, creator, difficulty, approach,
        period, orientation, rock_type, cliff_height, location
      )
      VALUES (
        'Saint Ferréol', 'Loin des spots sur fréquentés des bords de route, on profite ici autant de l''escalade que du milieu naturel. La vue y est splendide et l''ambiance sauvage.', '{"http://www.montagne-escalade.com/site/uploads/2659.jpg"}', 'Outdoor', '9a51440b-313d-4a42-98df-3e5b14432793', 'Medium', '(Du parking jusqu’au pied des falaises 30mn)
Suivre le chemin agricole jusqu’aux deux ruisseaux que l’on traverse à gué pour prendre pied sur l’autre rive au bord d’un champ de lavande. Longer le champ sur la droite (Nord) jusqu’à son extrémité nord où l’on retrouve un petit sentier qui part en ascendance sur la gauche (au dessus du champ). Ce sentier d’abord peu marqué, rejoint un chemin qui s’élève vers la droite (Nord) et que vous suivrez pendant 5mn environ. Le quitter pour prendre un bon sentier qui revient vers la gauche (Sud) dans des sous-bois de pins à crocher. Après 5mn environ de marche en légère montée, le sentier prend à droite face à la pente en devenant beaucoup plus raide dans un sous-bois de chênes.
Ensuite, au bout de 10mn de marche et après avoir rencontré un petit pierrier, on arrive à une bifurcation qui se situe sous un petit socle rocheux de dalles inclinées. Le sentier qui part à droite mène en 5mn aux deux secteurs du bas. (”érection aléatoire" droite et gauche). Le sentier qui part à gauche conduit en 5mn aux secteurs du haut (“Dévers” et “Jérusalem-Est”).',
        '{"March","April","May","September","October","November"}', '{"SE"}', 'Calcaire', 25, (SELECT id FROM new_location)
      );
    
      WITH new_location AS (
        INSERT INTO locations (latitude, longitude, city, department, country)
        VALUES (45.5508, 3.106, 'Saint-Floret', 'Puy-de-Dôme', 83)
        RETURNING id
      )
      INSERT INTO spots (
        name, description, image, type, creator, difficulty, approach,
        period, orientation, rock_type, cliff_height, location
      )
      VALUES (
        'SAINT FLORET', 'Petit site en bordure de la Couze, assez frais en été.
Belles ballades touristiques dans cette vallée à l''écart des  routes encombrées.', '{}', 'Outdoor', '9a51440b-313d-4a42-98df-3e5b14432793', 'Medium', 'Après avoir tourné à gauche, monter par ce chemin de terre entre les maisons puis en descente douce jusqu''au rocher.',
        '{"April","May","June","July","August","September","October"}', '{"NW"}', 'Granite', 8, (SELECT id FROM new_location)
      );
    
      WITH new_location AS (
        INSERT INTO locations (latitude, longitude, city, department, country)
        VALUES (44.7716, 5.28978, 'Sainte-Croix', 'Drôme', 83)
        RETURNING id
      )
      INSERT INTO spots (
        name, description, image, type, creator, difficulty, approach,
        period, orientation, rock_type, cliff_height, location
      )
      VALUES (
        'Saint Genix', 'SITE NON ENTRETENU ACTUELLEMENT 

Vieux site d''initiation laissé à l''abandon.', '{"http://www.montagne-escalade.com/site/uploads/2919.jpg"}', 'Outdoor', '9a51440b-313d-4a42-98df-3e5b14432793', 'Easy', '',
        '{}', '{"SW"}', 'Calcaire', NULL, (SELECT id FROM new_location)
      );
    
      WITH new_location AS (
        INSERT INTO locations (latitude, longitude, city, department, country)
        VALUES (48.0729, 7.29032, 'Wintzenheim', 'Haut-Rhin', 83)
        RETURNING id
      )
      INSERT INTO spots (
        name, description, image, type, creator, difficulty, approach,
        period, orientation, rock_type, cliff_height, location
      )
      VALUES (
        'Saint Gilles- Wintzenheim', 'Quelque gros blocs', '{}', 'Outdoor', '9a51440b-313d-4a42-98df-3e5b14432793', 'Medium', '',
        '{}', '{}', 'Grés', 1, (SELECT id FROM new_location)
      );
    
      WITH new_location AS (
        INSERT INTO locations (latitude, longitude, city, department, country)
        VALUES (44.8464, 6.59056, 'Saint Martin de Queyrière', 'Hautes-Alpes', 83)
        RETURNING id
      )
      INSERT INTO spots (
        name, description, image, type, creator, difficulty, approach,
        period, orientation, rock_type, cliff_height, location
      )
      VALUES (
        'Saint Martin de Queyrière', 'Accès en transport en commun. 
Falaises de : La vignette, La Casse, Rocher Baron, Ste marguerite, Le Rif d''Oriol', '{}', 'Outdoor', '9a51440b-313d-4a42-98df-3e5b14432793', 'Medium', 'Accès en transport en commun.',
        '{}', '{}', 'Gneiss', 30, (SELECT id FROM new_location)
      );
    
      WITH new_location AS (
        INSERT INTO locations (latitude, longitude, city, department, country)
        VALUES (46.3612, 5.75336, 'Pratz', 'Jura', 83)
        RETURNING id
      )
      INSERT INTO spots (
        name, description, image, type, creator, difficulty, approach,
        period, orientation, rock_type, cliff_height, location
      )
      VALUES (
        'Saint Romain', NULL, '{}', 'Outdoor', '9a51440b-313d-4a42-98df-3e5b14432793', 'Medium', '',
        '{}', '{}', '', NULL, (SELECT id FROM new_location)
      );
    
      WITH new_location AS (
        INSERT INTO locations (latitude, longitude, city, department, country)
        VALUES (44.1527, 1.75833, 'Saint-Antonin-Noble-Val', 'Tarn et Garonne', 83)
        RETURNING id
      )
      INSERT INTO spots (
        name, description, image, type, creator, difficulty, approach,
        period, orientation, rock_type, cliff_height, location
      )
      VALUES (
        'Saint-Antonin-Noble-Val', 'Majorité de voies surplombantes, très dures.
Voir les fiches par site.', '{}', 'Outdoor', '9a51440b-313d-4a42-98df-3e5b14432793', 'Medium', 'Une dizaine de groupes de rochers dominant l''Aveyron et la D115b, entre St-Antonin et Bruniquel.
Depuis la D115 ou ma D115b.
Voir les fiches par site.',
        '{}', '{}', 'Calcaire', NULL, (SELECT id FROM new_location)
      );
    
      WITH new_location AS (
        INSERT INTO locations (latitude, longitude, city, department, country)
        VALUES (44.093, 1.73387, 'Penne', 'Tarn', 83)
        RETURNING id
      )
      INSERT INTO spots (
        name, description, image, type, creator, difficulty, approach,
        period, orientation, rock_type, cliff_height, location
      )
      VALUES (
        'Saint-Antonin-Noble-Val - Amiel', 'Equipement et rocher de qualités variables.
garer le véhicule en bordure de route sans gèner. 
Accès 20 mn de marche. 
2 secteurs d''escalade. 40 voies environ de 10 à 25m.', '{}', 'Outdoor', '9a51440b-313d-4a42-98df-3e5b14432793', 'Medium', 'A 10 km au SSO de St-Antonin, rive gauche de l''Aveyron.
De St-Antonin suivre la D115 jusqu''au hameau de Amiel, 2 km avant Penne, les rochers sont au-dessus.',
        '{}', '{"S"}', 'Calcaire', 20, (SELECT id FROM new_location)
      );
    
      WITH new_location AS (
        INSERT INTO locations (latitude, longitude, city, department, country)
        VALUES (44.1524, 1.75329, 'St-Antonin-Noble-Val', 'Tarn et Garonne', 83)
        RETURNING id
      )
      INSERT INTO spots (
        name, description, image, type, creator, difficulty, approach,
        period, orientation, rock_type, cliff_height, location
      )
      VALUES (
        'Saint-Antonin-Noble-Val - Manjo-Carn', 'Partiellement équipé.
4 Secteurs d''escalade.Terrain privé, rester au plus près de la falaise.
Voies de 10 à 90m. 170 voies environs sont équipées.', '{}', 'Outdoor', '9a51440b-313d-4a42-98df-3e5b14432793', 'Medium', 'Remonter un chemin en direction des rochers bien visibles.',
        '{}', '{}', 'Calcaire', 40, (SELECT id FROM new_location)
      );