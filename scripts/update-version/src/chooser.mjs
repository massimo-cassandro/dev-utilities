import inquirer from 'inquirer';
import { params } from './params.mjs';

export async function chooser() {

  let choices_array;
  if(params.preRelease === false) {
    choices_array = [
      {
        name: 'Aggiorna la patch version',
        value: 'patch',
      },
      {
        name: 'Aggiorna la minor version',
        value: 'minor',
      },
      {
        name: 'Aggiorna la major version',
        value: 'major',
      }
    ]
      .concat(
        params.preRealeaseTags.map(tag => {
          return {
            name: `Passa alla pre-release “${tag}”`,
            value: `switch-prerelease-${tag}`
          };
        })
      )
      .concat([{
        name: 'Annulla',
        value: 'none',
      }]);


  } else {
    choices_array = [
      {
        name: `Aggiorna la pre-release attuale (${params.preRelease})`,
        value: 'upd-prerelease'
      },
      {
        name: 'Rimuovi pre-release',
        value: 'remove-prerelease'
      }
    ].concat(
      params.preRealeaseTags.filter(tag =>
        tag !== params.preRelease && params.preRealeaseTags.indexOf(tag) > params.preRealeaseTags.indexOf(params.preRelease )
      )
        .map(tag => {
          return {
            name: `Passa alla pre-release “${tag}”`,
            value: `switch-prerelease-${tag}`
          };
        })
    );
  }

  return await inquirer
    .prompt([
      {
        type: 'list',
        default: 0,
        name: 'mode',
        message: 'Aggiorna:',
        choices: choices_array
      }
    ])
    .then((answer) => {

      if(answer.mode !== 'none') {

        if(!params.cfg.skipDescrPrompt) {
          inquirer
            .prompt([
              {
                type: 'input',
                name: 'descr',
                message: 'Descrizione: ',
                default() {
                  return params.cfg.defaultDescr;
                }
              }
            ])
            .then((answer2) => {
              params.log_item.descr= answer2.descr.trim()? answer2.descr.trim() : null;
              return answer.mode;
            });

        } else {
          return answer.mode;
        }

      } else {
        return null;
      }
    });
}
