CREATE TABLE `bedroom` (
  `id` int(11) NOT NULL,
  `temperature` double NOT NULL,
  `humidity` double NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `bedroom`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `bedroom`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

