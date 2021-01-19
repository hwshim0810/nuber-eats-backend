import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnection } from 'typeorm';

const ENDPOINT = '/graphql';

jest.mock('got', () => ({
  post: jest.fn(),
}));

describe('UserModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    app.close();
  });

  describe('createAccount', () => {
    const EMAIL = 'test@test.com';
    it('should create account', () => {
      return request(app.getHttpServer())
        .post(ENDPOINT)
        .send({
          query: `
          mutation {
            createAccount(input: {
              email: "${EMAIL}",
              password: "pass111",
              role: Owner,
            }) {
              ok
              error
            }
          }
        `,
        })
        .expect(200)
        .expect(res => {
          expect(res.body.data.createAccount.ok).toBe(true);
          expect(res.body.data.createAccount.error).toBe(null);
        });
    });

    it('should fail if account already exists', () => {
      return request(app.getHttpServer())
        .post(ENDPOINT)
        .send({
          query: `
        mutation {
          createAccount(input: {
            email: "${EMAIL}",
            password: "pass111",
            role: Owner,
          }) {
            ok
            error
          }
        }
      `,
        })
        .expect(200)
        .expect(res => {
          expect(res.body.data.createAccount.ok).toBe(false);
          expect(res.body.data.createAccount.error).toEqual(expect.any(String));
        });
    });
  });
});
