import { MigrationInterface, QueryRunner } from "typeorm";

export class Menus1709270415610 implements MigrationInterface {
    name = 'Menus1709270415610'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`logs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`path\` varchar(255) NOT NULL, \`method\` varchar(255) NOT NULL, \`data\` varchar(255) NOT NULL, \`result\` int NOT NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`menus\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`path\` varchar(255) NOT NULL, \`order\` int NOT NULL, \`acl\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`profile\` (\`id\` int NOT NULL AUTO_INCREMENT, \`gender\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`userId\` int NULL, UNIQUE INDEX \`REL_a24972ebd73b106250713dcddd\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`role_menus\` (\`menusId\` int NOT NULL, \`rolesId\` int NOT NULL, INDEX \`IDX_cf82e501e9b61eab5d815ae3b0\` (\`menusId\`), INDEX \`IDX_135e41fb3c98312c5f171fe9f1\` (\`rolesId\`), PRIMARY KEY (\`menusId\`, \`rolesId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_roles\` (\`userId\` int NOT NULL, \`rolesId\` int NOT NULL, INDEX \`IDX_472b25323af01488f1f66a06b6\` (\`userId\`), INDEX \`IDX_13380e7efec83468d73fc37938\` (\`rolesId\`), PRIMARY KEY (\`userId\`, \`rolesId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`logs\` ADD CONSTRAINT \`FK_a1196a1956403417fe3a0343390\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`profile\` ADD CONSTRAINT \`FK_a24972ebd73b106250713dcddd9\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`role_menus\` ADD CONSTRAINT \`FK_cf82e501e9b61eab5d815ae3b0a\` FOREIGN KEY (\`menusId\`) REFERENCES \`menus\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`role_menus\` ADD CONSTRAINT \`FK_135e41fb3c98312c5f171fe9f1c\` FOREIGN KEY (\`rolesId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_roles\` ADD CONSTRAINT \`FK_472b25323af01488f1f66a06b67\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_roles\` ADD CONSTRAINT \`FK_13380e7efec83468d73fc37938e\` FOREIGN KEY (\`rolesId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_roles\` DROP FOREIGN KEY \`FK_13380e7efec83468d73fc37938e\``);
        await queryRunner.query(`ALTER TABLE \`user_roles\` DROP FOREIGN KEY \`FK_472b25323af01488f1f66a06b67\``);
        await queryRunner.query(`ALTER TABLE \`role_menus\` DROP FOREIGN KEY \`FK_135e41fb3c98312c5f171fe9f1c\``);
        await queryRunner.query(`ALTER TABLE \`role_menus\` DROP FOREIGN KEY \`FK_cf82e501e9b61eab5d815ae3b0a\``);
        await queryRunner.query(`ALTER TABLE \`profile\` DROP FOREIGN KEY \`FK_a24972ebd73b106250713dcddd9\``);
        await queryRunner.query(`ALTER TABLE \`logs\` DROP FOREIGN KEY \`FK_a1196a1956403417fe3a0343390\``);
        await queryRunner.query(`DROP INDEX \`IDX_13380e7efec83468d73fc37938\` ON \`user_roles\``);
        await queryRunner.query(`DROP INDEX \`IDX_472b25323af01488f1f66a06b6\` ON \`user_roles\``);
        await queryRunner.query(`DROP TABLE \`user_roles\``);
        await queryRunner.query(`DROP INDEX \`IDX_135e41fb3c98312c5f171fe9f1\` ON \`role_menus\``);
        await queryRunner.query(`DROP INDEX \`IDX_cf82e501e9b61eab5d815ae3b0\` ON \`role_menus\``);
        await queryRunner.query(`DROP TABLE \`role_menus\``);
        await queryRunner.query(`DROP INDEX \`REL_a24972ebd73b106250713dcddd\` ON \`profile\``);
        await queryRunner.query(`DROP TABLE \`profile\``);
        await queryRunner.query(`DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
        await queryRunner.query(`DROP TABLE \`menus\``);
        await queryRunner.query(`DROP TABLE \`logs\``);
    }

}
