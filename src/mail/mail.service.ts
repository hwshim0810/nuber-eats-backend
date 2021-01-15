import { Inject, Injectable } from '@nestjs/common';
import * as FormData from 'form-data';
import got from 'got';

import { CONFIG_OPTIONS } from '../common/common.constants';
import { MailModuleOptions } from './mail.interfaces';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}

  private sendEmail(subject: string, content: string, to: string) {
    const form = new FormData();
    form.append('from', `Excited User <mailgun@${this.options.domain}>`);
    form.append('to', to);
    form.append('subject', subject);
    form.append('text', content);
    await got(`https://api.mailgun.net/v3/${this.options.domain}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(
          `api:${this.options.apiKey}`,
        ).toString('base64')}`,
      },
      body: form,
    });
  }
}
