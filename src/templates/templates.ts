import { commilint } from './commilint';
import { conventional } from './conventional';
import { angular } from './conventional';

interface ITemplates {
  [key: string]: string[];
}

const commitTemplates: ITemplates = {
  commitlint: commilint,
  conventional: conventional,
  angular: angular,
};

export default commitTemplates;
