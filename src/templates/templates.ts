import { commilint } from './commilint';
import { conventional } from './conventional';

interface ITemplates {
  [key: string]: string[];
}

const commitTemplates: ITemplates = {
  commitlint: commilint,
  conventional: conventional,
};

export default commitTemplates;
