DROP DATABASE rotacao_culturas;
CREATE DATABASE rotacao_culturas;
USE rotacao_culturas;

CREATE TABLE culturas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(20) NOT NULL
);

CREATE TABLE cultura_nova (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cultura_id INT,
    nome VARCHAR(20),
	motivo VARCHAR(200),
    FOREIGN KEY (cultura_id) REFERENCES culturas(id)
);

CREATE TABLE pragas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    periodo_ataque VARCHAR(200),
    alimentacao VARCHAR(200),
    atracao VARCHAR(200)
);

CREATE TABLE cultura_pragas (
    cultura_id INT,
    praga_id INT,
    PRIMARY KEY (cultura_id, praga_id),
    FOREIGN KEY (cultura_id) REFERENCES culturas(id),
    FOREIGN KEY (praga_id) REFERENCES pragas(id)
);

CREATE TABLE adubacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cultura_id INT,
    tipo_fertilizante VARCHAR(50),
    frequencia VARCHAR(200),
    materia_organica VARCHAR(200),
    FOREIGN KEY (cultura_id) REFERENCES culturas(id)
);

CREATE TABLE tipo_solo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    recomendacao VARCHAR(200)
);

CREATE TABLE cultura_solo (
    cultura_id INT,
    solo_id INT,
    PRIMARY KEY (cultura_id, solo_id),
    FOREIGN KEY (cultura_id) REFERENCES culturas(id),
    FOREIGN KEY (solo_id) REFERENCES tipo_solo(id)
);

CREATE TABLE clima (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cultura_id INT,
    temperatura VARCHAR(200),
    umidade VARCHAR(200),
    chuvas VARCHAR(200),
    FOREIGN KEY (cultura_id) REFERENCES culturas(id)
);