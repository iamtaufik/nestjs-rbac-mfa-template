import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1763346793341 implements MigrationInterface {
  name = 'InitSchema1763346793341';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "M_ROLEPERM" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "ROLEID" uuid NOT NULL, "PERMID" uuid NOT NULL, "CRDAT" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "UPDAT" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "UK_M_ROLEPERM_ROLE_PERM" UNIQUE ("ROLEID", "PERMID"), CONSTRAINT "PK_e1300a6ba4069cf279f84f4392c" PRIMARY KEY ("ID"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "M_PERM" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "PRMCD" character varying(100) NOT NULL, "PRMNM" character varying(150) NOT NULL, "DESCR" text, "ISACT" boolean NOT NULL DEFAULT true, "CRDAT" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "UPDAT" TIMESTAMP WITH TIME ZONE, "PGID" uuid, CONSTRAINT "PK_e657bbb624babeba938ff406c60" PRIMARY KEY ("ID"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UX_M_PERM_PRMCD" ON "M_PERM" ("PRMCD") `,
    );
    await queryRunner.query(
      `CREATE TABLE "M_PAGE" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "PGCD" character varying(100) NOT NULL, "PGNM" character varying(150) NOT NULL, "PGURL" character varying(255) NOT NULL, "PGICON" character varying(100), "PGORD" integer NOT NULL DEFAULT '0', "ISACT" boolean NOT NULL DEFAULT true, "CRDAT" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "UPDAT" TIMESTAMP WITH TIME ZONE, "PRNTID" uuid, CONSTRAINT "PK_b8770e2845eb6a97eea836f0225" PRIMARY KEY ("ID"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UX_M_PAGE_PGURL" ON "M_PAGE" ("PGURL") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UX_M_PAGE_PGCD" ON "M_PAGE" ("PGCD") `,
    );
    await queryRunner.query(
      `CREATE TABLE "M_ROLEPAGE" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "ROLEID" uuid NOT NULL, "PAGEID" uuid NOT NULL, "CANVW" boolean NOT NULL DEFAULT true, "CANCR" boolean NOT NULL DEFAULT false, "CANUP" boolean NOT NULL DEFAULT false, "CANDL" boolean NOT NULL DEFAULT false, "CRDAT" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "UPDAT" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "UK_M_ROLEPAGE_ROLE_PAGE" UNIQUE ("ROLEID", "PAGEID"), CONSTRAINT "PK_c02717d43350c4e94bbace1929f" PRIMARY KEY ("ID"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "M_ROLE" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "ROLCD" character varying(50) NOT NULL, "ROLNM" character varying(100) NOT NULL, "DESCR" text, "ISACT" boolean NOT NULL DEFAULT true, "CRDAT" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "UPDAT" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_dccd58965090a0fe11c85d7ab6f" PRIMARY KEY ("ID"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UX_M_ROLE_ROLCD" ON "M_ROLE" ("ROLCD") `,
    );
    await queryRunner.query(
      `CREATE TABLE "M_USERROLE" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "BEGDA" date NOT NULL DEFAULT ('now'::text)::date, "ENDDA" date, "CRDAT" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "UPDAT" TIMESTAMP WITH TIME ZONE, "USERID" uuid, "ROLEID" uuid, CONSTRAINT "UK_M_USERROLE_USER_ROLE_BE" UNIQUE ("USERID", "ROLEID", "BEGDA"), CONSTRAINT "PK_e0747391e9cd24702a69962a444" PRIMARY KEY ("ID"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "M_MFAFACTOR" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "FATYP" character varying(20) NOT NULL, "SECRK" text NOT NULL, "ISPRM" boolean NOT NULL DEFAULT false, "ISACT" boolean NOT NULL DEFAULT true, "CRDAT" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "UPDAT" TIMESTAMP WITH TIME ZONE, "USERID" uuid, CONSTRAINT "PK_dc7beb7632a96b557a88a6ab9f9" PRIMARY KEY ("ID"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IX_M_MFAFACTOR_USERID" ON "M_MFAFACTOR" ("USERID") `,
    );
    await queryRunner.query(
      `CREATE TABLE "T_MFATOKEN" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "FATYP" character varying(20) NOT NULL, "TOKEN" character varying(16) NOT NULL, "EXDAT" TIMESTAMP WITH TIME ZONE NOT NULL, "ISUSD" boolean NOT NULL DEFAULT false, "CRDAT" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "USERID" uuid, CONSTRAINT "PK_a2a4d44bf2d169f4a32a08d7813" PRIMARY KEY ("ID"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IX_T_MFATOKEN_USER_FATYP" ON "T_MFATOKEN" ("USERID", "FATYP", "ISUSD", "EXDAT") `,
    );
    await queryRunner.query(
      `CREATE TABLE "M_USER" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "USRNM" character varying(100) NOT NULL, "EMADR" character varying(255) NOT NULL, "PWD" character varying(255) NOT NULL, "ISACT" boolean NOT NULL DEFAULT true, "CRDAT" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "UPDAT" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_7519e06750a7122940be0625be0" PRIMARY KEY ("ID"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UX_M_USER_EMADR" ON "M_USER" ("EMADR") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UX_M_USER_USRNM" ON "M_USER" ("USRNM") `,
    );
    await queryRunner.query(
      `ALTER TABLE "M_ROLEPERM" ADD CONSTRAINT "FK_4d5e3f3c718d76b0bc09f2cc1d0" FOREIGN KEY ("ROLEID") REFERENCES "M_ROLE"("ID") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "M_ROLEPERM" ADD CONSTRAINT "FK_de11283007736dad74f2897842a" FOREIGN KEY ("PERMID") REFERENCES "M_PERM"("ID") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "M_PERM" ADD CONSTRAINT "FK_23dd0051450c797bf12ef8c6784" FOREIGN KEY ("PGID") REFERENCES "M_PAGE"("ID") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "M_PAGE" ADD CONSTRAINT "FK_249d83c474699b34cdc7467cb7b" FOREIGN KEY ("PRNTID") REFERENCES "M_PAGE"("ID") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "M_ROLEPAGE" ADD CONSTRAINT "FK_c901dd3f28aa1a2c9c9851a94f5" FOREIGN KEY ("ROLEID") REFERENCES "M_ROLE"("ID") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "M_ROLEPAGE" ADD CONSTRAINT "FK_68616205e8e2b26eee40d4e8f0b" FOREIGN KEY ("PAGEID") REFERENCES "M_PAGE"("ID") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "M_USERROLE" ADD CONSTRAINT "FK_fe4536e17eb3c532c09e2ef2565" FOREIGN KEY ("USERID") REFERENCES "M_USER"("ID") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "M_USERROLE" ADD CONSTRAINT "FK_ffb7b891e7ddd114334f11c4117" FOREIGN KEY ("ROLEID") REFERENCES "M_ROLE"("ID") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "M_MFAFACTOR" ADD CONSTRAINT "FK_905068a62314b2bc9eb57856677" FOREIGN KEY ("USERID") REFERENCES "M_USER"("ID") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "T_MFATOKEN" ADD CONSTRAINT "FK_67fda245edecb8e4d68d95e5b7b" FOREIGN KEY ("USERID") REFERENCES "M_USER"("ID") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "T_MFATOKEN" DROP CONSTRAINT "FK_67fda245edecb8e4d68d95e5b7b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "M_MFAFACTOR" DROP CONSTRAINT "FK_905068a62314b2bc9eb57856677"`,
    );
    await queryRunner.query(
      `ALTER TABLE "M_USERROLE" DROP CONSTRAINT "FK_ffb7b891e7ddd114334f11c4117"`,
    );
    await queryRunner.query(
      `ALTER TABLE "M_USERROLE" DROP CONSTRAINT "FK_fe4536e17eb3c532c09e2ef2565"`,
    );
    await queryRunner.query(
      `ALTER TABLE "M_ROLEPAGE" DROP CONSTRAINT "FK_68616205e8e2b26eee40d4e8f0b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "M_ROLEPAGE" DROP CONSTRAINT "FK_c901dd3f28aa1a2c9c9851a94f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "M_PAGE" DROP CONSTRAINT "FK_249d83c474699b34cdc7467cb7b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "M_PERM" DROP CONSTRAINT "FK_23dd0051450c797bf12ef8c6784"`,
    );
    await queryRunner.query(
      `ALTER TABLE "M_ROLEPERM" DROP CONSTRAINT "FK_de11283007736dad74f2897842a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "M_ROLEPERM" DROP CONSTRAINT "FK_4d5e3f3c718d76b0bc09f2cc1d0"`,
    );
    await queryRunner.query(`DROP INDEX "public"."UX_M_USER_USRNM"`);
    await queryRunner.query(`DROP INDEX "public"."UX_M_USER_EMADR"`);
    await queryRunner.query(`DROP TABLE "M_USER"`);
    await queryRunner.query(`DROP INDEX "public"."IX_T_MFATOKEN_USER_FATYP"`);
    await queryRunner.query(`DROP TABLE "T_MFATOKEN"`);
    await queryRunner.query(`DROP INDEX "public"."IX_M_MFAFACTOR_USERID"`);
    await queryRunner.query(`DROP TABLE "M_MFAFACTOR"`);
    await queryRunner.query(`DROP TABLE "M_USERROLE"`);
    await queryRunner.query(`DROP INDEX "public"."UX_M_ROLE_ROLCD"`);
    await queryRunner.query(`DROP TABLE "M_ROLE"`);
    await queryRunner.query(`DROP TABLE "M_ROLEPAGE"`);
    await queryRunner.query(`DROP INDEX "public"."UX_M_PAGE_PGCD"`);
    await queryRunner.query(`DROP INDEX "public"."UX_M_PAGE_PGURL"`);
    await queryRunner.query(`DROP TABLE "M_PAGE"`);
    await queryRunner.query(`DROP INDEX "public"."UX_M_PERM_PRMCD"`);
    await queryRunner.query(`DROP TABLE "M_PERM"`);
    await queryRunner.query(`DROP TABLE "M_ROLEPERM"`);
  }
}
