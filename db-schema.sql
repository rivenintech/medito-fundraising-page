DROP TABLE IF EXISTS Fundraisers;
DROP TABLE IF EXISTS Donations;
CREATE TABLE Fundraisers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(100),
    description TEXT,
    goalAmount DECIMAL(10, 2),
    startDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    isActive BOOLEAN DEFAULT true NOT NULL,
    totalRaised DECIMAL(10, 2) DEFAULT 0.00 NOT NULL,
    totalDonations INTEGER DEFAULT 0 NOT NULL
);
CREATE TABLE Donations (
    id VARCHAR(100) PRIMARY KEY,
    fundraiserID INTEGER NOT NULL,
    donorName VARCHAR(100),
    donorEmail VARCHAR(100),
    amount DECIMAL(10, 2) NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fundraiserID) REFERENCES Fundraisers(id)
);
