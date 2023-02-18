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
      },
      {
        name: 'Aggiorna la minor version + pre-release',
        value: 'minor+pre',
      },
      {
        name: 'Aggiorna la major version + pre-release',
        value: 'major+pre',
      },
      {
        name: 'Annulla',
        value: 'annulla',
      }
    ];


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

  return await (async() => {

    if(params.cfg.patchOnly) {

      return {
        mode: params.preRelease === false? 'patch' : 'upd-prerelease'
      };

    } else {

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
        .then( answer => {

          if(/\+pre$/.test(answer.mode)) {

            return (async () => {

              return await inquirer
                .prompt([
                  {
                    type: 'list',
                    name: 'tag',
                    message: 'Pre-release tag:',
                    default: 3,
                    choices: params.preRealeaseTags.map(tag => {
                      return {
                        name: tag,
                        value: tag
                      };
                    })
                      .concat([
                        {
                          name: 'Annulla',
                          value: 'annulla',
                        }
                      ])
                  }
                ])
                .then((answerTag) => {

                  if(answerTag.tag !== 'annulla') {

                    answer.mode = 'add-pre|' + answer.mode.replace('+pre', `|${answerTag.tag}`);
                  } else {
                    answer.mode = 'annulla';
                  }
                  return answer;

                });
            })();

          } else {
            return answer;
          }
        });

    } // end else if patchOnly

  })()
    .then( answer => {

      if(answer.mode !== 'annulla') {

        if(!params.cfg.skipDescrPrompt) {

          return (async () => {

            return await inquirer
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
              .then((answerDescr) => {
                params.log_item.descr= answerDescr.descr.trim()? answerDescr.descr.trim() : null;
                return answer.mode;
              });

          })();

        } else {
          return answer.mode;
        }

      } else {
        return null;
      }
    });
}
