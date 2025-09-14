
const multer = require('multer');
const authController = require('../controllers/login/authController');
const atasController = require('../controllers/institucional/atasController');
const consorcioController = require('../controllers/institucional/consorcioController');
const contratosRateioController = require('../controllers/institucional/contratosRateioController');
const andamentoController = require('../controllers/contratos-licitacoes/andamentoController');
const licitacoesController = require('../controllers/contratos-licitacoes/licitacoesController');
const municipiosController = require('../controllers/consorcio/municipiosController');
const newsConsorcioCategoryController = require('../controllers/news/newsConsorcioCategoryController');
const newsConsorcioController = require('../controllers/news/newsConsorcioController');
const polosController = require('../controllers/consorcio/polosController');
const categoriesPsController = require('../controllers/processo-seletivo/categoriesPsController');
const processoSeletivoController = require('../controllers/processo-seletivo/processoSeletivoController');
const transparencyConsorcioController = require('../controllers/consorcio/transparencyConsorcioController');
const userController = require('../controllers/login/userController');
const headerController = require('../controllers/header/headerController');
const homeController = require('../controllers/home/homeController');
const videosController = require('../controllers/consorcio/videosController');
const lrfController = require('../controllers/lrf-contas-publicas/lrfController');
const leisController = require('../controllers/lrf-contas-publicas/leisController');
const configuracoesController = require('../controllers/configuracoes/configuracoesController');
const arquivosPoloController = require('../controllers/consorcio/arquivosPoloController');
const contratosController = require('../controllers/contratos-licitacoes/contratosController');
const orcamentoContabilController = require('../controllers/lrf-contas-publicas/orcamentoContabilController');
const balancoPatrimonialController = require('../controllers/lrf-contas-publicas/balancoPatrimonialController');
const pesquisaController = require('../controllers/pesquisa/pesquisaController');
const servicosAtividadesController = require('../controllers/lrf-contas-publicas/servicosAtividadesController');
const ouvidoriaController = require('../controllers/ouvidoria/ouvidoriaController');
const respostasManifestacaoController = require('../controllers/ouvidoria/respostasManifestacaoController');
const folhaPagamentoController = require('../controllers/lrf-contas-publicas/folhaPagamentoController');
const contratosProgramaController = require('../controllers/institucional/contratosProgramaController');
const vagasController = require('../controllers/vagas/vagasController');
const resultadosController = require('../controllers/consorcio/resultadosController');
const funcoesController = require('../controllers/consorcio/funcoesController');
const router = require('express').Router();

router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));

/*--------------------------- (CONSORCIO) - ROTAS DO HEADER ---------------------------*/
//cadastra o header
router.post('/register-header', multer(headerController).fields([
    {name: 'logo'},
    {name: 'background'},
]), headerController.registerHeader);
//obtem dados do header
router.get('/header', headerController.geHeader);
//atualiza o header
router.patch('/update-header/:id', multer(headerController).fields([
    {name: 'logo'},
    {name: 'background'},
]), headerController.updateHeader);

/*--------------------------- (CONSORCIO) - ROTAS DA HOME ---------------------------*/
//cadastra a home
router.post('/register-home', multer(homeController).fields([
    {name: 'banner1'},
    {name: 'banner2'},
    {name: 'banner3'},
    {name: 'banner4'},
    {name: 'banner5'},
    {name: 'banner6'}
]), homeController.registerHome);
//obtem dados da home
router.get('/home', homeController.getHome);
//atualiza a home
router.patch('/update-home/:id', multer(homeController).fields([
    {name: 'banner1'},
    {name: 'banner2'},
    {name: 'banner3'},
    {name: 'banner4'},
    {name: 'banner5'},
    {name: 'banner6'}
]), homeController.updateHome);

/*--------------------------- (CONSORCIO) - ROTAS DE VÌDEOS ---------------------------*/
//adiciona um novo video
router.post('/new-video', videosController.newVideo);
//obtem todos os videos
router.get('/all-videos', videosController.getVideos);
//atualiza o video
router.patch('/update-video/:id', videosController.updateVideo);
//deleta o video
router.delete('/delete-video/:id', videosController.deleteVideo);

/*--------------------------- (CONSORCIO) - ROTAS DE LRF ---------------------------*/
//adiciona uma nova LRF
router.post('/new-lrf',  multer(lrfController).array('file'), lrfController.newLrf);
//obtem todas as LRF
router.get('/all-lrf', lrfController.getAllLrf);
//atualiza a LRF
router.patch('/update-lrf/:id', multer(lrfController).array('file'), lrfController.updateLrf);
//deleta a LRF
router.delete('/delete-lrf/:id', lrfController.deleteLrf);

/*--------------------------- (CONSORCIO) -  ROTAS DE LEIS ---------------------------*/
//adiciona uma nova LEI
router.post('/new-lei',  multer(leisController).array('file'), leisController.newLei);
//obtem todas as LEI
router.get('/all-leis', leisController.getAllLeis);
//atualiza a LEI
router.patch('/update-lei/:id', multer(leisController).array('file'), leisController.updateLei);
//deleta a LEI
router.delete('/delete-lei/:id', leisController.deleteLei);

/*--------------------------- (CONSORCIO) - ROTAS DE MUNICIPIOS  ---------------------------*/
//adiciona um novo municipio
router.post('/new-county', multer(municipiosController).array('file'), municipiosController.newCounty);
//obtem todos os municipios
router.get('/all-county', municipiosController.getCounty);
//atualiza o municipio
router.patch('/update-county/:id', multer(municipiosController).array('file'), municipiosController.updateCounty);
//deleta o municipio
router.delete('/delete-county/:id', municipiosController.deleteCounty);

/*--------------------------- (CONSORCIO) - ROTAS DE POLOS  ---------------------------*/
const uploadFields = [
    {name: 'file', maxCount: 1},
    {name: 'imagens'},
];

router.post('/new-polo', multer(polosController).fields(uploadFields), polosController.newPolo);
router.get('/all-polos', polosController.getPolos);
router.patch('/update-polo/:id', multer(polosController).fields(uploadFields), polosController.updatePolo);
router.delete('/delete-polo/:id', polosController.deletePolo);

/*--------------------------- (CONSORCIO) - ROTAS DE ARQUIVOS DE POLO ---------------------------*/
//adiciona uma novo arquivo
router.post('/new-arquivo',  multer(arquivosPoloController).array('file'), arquivosPoloController.newArquivo);
//obtem todas os arquivos
router.get('/all-arquivos', arquivosPoloController.getAllArquivos);
//atualiza o arquivo
router.patch('/update-arquivo/:id', multer(arquivosPoloController).array('file'), arquivosPoloController.updateArquivo);
//deleta arquivo
router.delete('/delete-arquivo/:id', arquivosPoloController.deleteArquivo);

/*--------------------------- (CONSORCIO) - ROTAS DE CONSORCIO ---------------------------*/
//adiciona dados da consorcio
router.post('/new-consorcio', consorcioController.newConsorcio);
//obtem dados da consorcio
router.get('/all-consorcio', consorcioController.getConsorcio);
//atualiza dados da consorcio
router.patch('/update-consorcio/:id', consorcioController.updateConsorcio);

/*--------------------------- (CONSORCIO) - ROTAS DE CATEGORIAS DE NOTÍCIAS ---------------------------*/
//adiciona uma nova categoria
router.post('/new-consorcio-category', newsConsorcioCategoryController.newConsorcioCategory);
//obtem todos as categorias
router.get('/all-consorcio-categories', newsConsorcioCategoryController.getConsorcioCategories);
//atualiza a categoria
router.patch('/update-consorcio-category/:id', newsConsorcioCategoryController.updateConsorcioCategory);
//deleta a categpria
router.delete('/delete-consorcio-category/:id', newsConsorcioCategoryController.deleteConsorcioCategory);

/*--------------------------- (CONSORCIO) - ROTAS DE NOTÍCIAS ---------------------------*/
//adiciona uma nova noticia
router.post('/new-consorcio-news', multer(newsConsorcioController).array('file'), newsConsorcioController.newConsorcioNews);
//obtem todos as noticias
router.get('/all-consorcio-news', newsConsorcioController.getConsorcioNews);
//atualiza a noticia
router.patch('/update-consorcio-news/:id', multer(newsConsorcioController).array('file'), newsConsorcioController.updateConsorcioNews);
//deleta a noticia
router.delete('/delete-consorcio-news/:id', newsConsorcioController.deleteConsorcioNews);

/*--------------------------- (CONSORCIO) - ROTAS DE PROCESSO SELETIVO ---------------------------*/
//adiciona uma novo Processo Seletivo
router.post('/new-processo-seletivo',  multer(processoSeletivoController).array('file'), processoSeletivoController.newProcessoSeletivo);
//obtem todas os Processo Seletivo
router.get('/all-processo-seletivo', processoSeletivoController.getAllProcessoSeletivo);
//atualiza o Processo Seletivo
router.patch('/update-processo-seletivo/:id', multer(processoSeletivoController).array('file'), processoSeletivoController.updateProcessoSeletivo);
//deleta o Processo Seletivo
router.delete('/delete-processo-seletivo/:id', processoSeletivoController.deleteProcessoSeletivo);

/*--------------------------- (CONSORCIO) - ROTAS DE CATEGORIAS DE PROCESSO SELETIVO ---------------------------*/
//adiciona uma nova categoria de processo seletivo
router.post('/new-ps-category', categoriesPsController.newPsCategory);
//obtem todos as categorias de processo seletivo
router.get('/all-ps-categories', categoriesPsController.getPsCategories);
//obtem todas as categorias de processo seletivo conforme busca
router.get('/search-ps-categories', categoriesPsController.getSearchCategories)
//atualiza a categoria de processo seletivo
router.patch('/update-ps-category/:id', categoriesPsController.updatePsCategory);
//deleta a categpria de processo seletivo
router.delete('/delete-ps-category/:id', categoriesPsController.deletePsCategory);

/*--------------------------- (CONSORCIO) - ROTAS DE CONTRATOS DE RATEIO ---------------------------*/
//adiciona uma novo Contrato
router.post('/new-contrato-rateio',  multer(contratosRateioController).array('file'), contratosRateioController.newContrato);
//obtem todas os Contratos
router.get('/all-contratos-rateio', contratosRateioController.getAllContratos);
//obtem todas os Contratos conforme busca
router.get('/search-contratos-rateio', contratosRateioController.getSearchContratos);
//atualiza o Contrato
router.patch('/update-contrato-rateio/:id', multer(contratosRateioController).array('file'), contratosRateioController.updateContrato);
//deleta o Contrato
router.delete('/delete-contrato-rateio/:id', contratosRateioController.deleteContrato);

/*--------------------------- (CONSORCIO) - ROTAS DE ATAS ---------------------------*/
//adiciona uma nova ata
router.post('/new-ata',  multer(atasController).array('file'), atasController.newAta);
//obtem todas as atas
router.get('/all-atas', atasController.getAllAtas);
//obtem todas as atas conforme busca
router.get('/search-atas', atasController.getSearchAtas);
//atualiza a ata
router.patch('/update-ata/:id', multer(atasController).array('file'), atasController.updateAtas);
//deleta a ata
router.delete('/delete-ata/:id', atasController.deleteAta);

/*--------------------------- (CONSORCIO) - ROTAS DE TRANSPARÊNCIA ---------------------------*/
//adiciona dados da transparencia
router.post('/new-transparency-consorcio', transparencyConsorcioController.newTransparency);
//obtem dados da transparencia
router.get('/all-transparency-consorcio', transparencyConsorcioController.getTransparency);
//atualiza dados da transparencia
router.patch('/update-transparency-consorcio/:id', transparencyConsorcioController.updateTransparency);

/*--------------------------- (CONSORCIO) - ROTAS DE LICITAÇÕES ---------------------------*/
//adiciona uma nova licitacao
router.post('/new-licitacao',  multer(licitacoesController).array('file'), licitacoesController.newLicitacao);
//obtem todas as licitacoes
router.get('/all-licitacoes', licitacoesController.getAllLicitacoes);
//obtem todas as licitacoes conforme busca
router.get('/search-licitacoes', licitacoesController.getSearchLicitacoes)
//atualiza a licitacao
router.patch('/update-licitacao/:id', multer(licitacoesController).array('file'), licitacoesController.updateLicitacao);
//deleta a licitacao
router.delete('/delete-licitacao/:id', licitacoesController.deleteLicitacao);

/*--------------------------- (CONSORCIO) - ROTAS DE ANDAMENTO DA LICITAÇÃO ---------------------------*/
//adiciona dados do andamento
router.post('/new-progress', andamentoController.newProgress);
//obtem dados do andamento
router.get('/all-progress', andamentoController.getProgress);

/*--------------------------- (CONSORCIO) - ROTAS DE CONTRATOS ---------------------------*/
//adiciona uma novo contrato
router.post('/new-contract',  multer(contratosController).array('file'), contratosController.newContract);
//obtem todas os contratos
router.get('/all-contracts', contratosController.getAllContracts);
//atualiza o contrato
router.patch('/update-contract/:id', multer(contratosController).array('file'), contratosController.updateContract);
//deleta o contrato
router.delete('/delete-contract/:id', contratosController.deleteContract);

/*--------------------------- (CONSORCIO) -  ROTAS DE USUÁRIO ---------------------------*/
//adiciona um novo usuário
router.post('/register', userController.register);
//login do usuário
router.post('/login', userController.login);
//obtem o usuário autenticado
router.get('/user', authController.verifyToken, userController.getUser);
//obtem todos os usuários
router.get('/user-all', userController.getUserAll);
//fazer logout
router.post('/logout', userController.logout);

/*--------------------------- (CONSORCIO) - ROTAS DE CONFIGURAÇÕES ---------------------------*/
//adiciona dados da configurações
router.post('/new-configuracoes', configuracoesController.novaConfiguracao);
//obtem dados da configurações
router.get('/all-configuracoes', configuracoesController.getConfiguracoes);
//atualiza dados da configurações
router.patch('/update-configuracoes/:id', configuracoesController.updateConfiguracoes);

/*--------------------------- (CONSORCIO) - ROTAS DE ORÇAMENTO CONTABIL ---------------------------*/
router.post('/new-orcamento-contabil',  multer(orcamentoContabilController).array('file'), orcamentoContabilController.newOrcamentoContabil);
router.get('/all-orcamento-contabil', orcamentoContabilController.getAllOrcamentoContabil);
router.patch('/update-orcamento-contabil/:id', multer(orcamentoContabilController).array('file'), orcamentoContabilController.updateOrcamentoContabil);
router.delete('/delete-orcamento-contabil/:id', orcamentoContabilController.deleteOrcamentoContabil);

/*--------------------------- (CONSORCIO) - ROTAS DE BALANÇO PATRIMONIAL ---------------------------*/
router.post('/new-balanco-patrimonial',  multer(balancoPatrimonialController).array('file'), balancoPatrimonialController.newBalancoPatrimonial);
router.get('/all-balanco-patrimonial', balancoPatrimonialController.getAllBalancoPatrimonial);
router.patch('/update-balanco-patrimonial/:id', multer(balancoPatrimonialController).array('file'), balancoPatrimonialController.updateBalancoPatrimonial);
router.delete('/delete-balanco-patrimonial/:id', balancoPatrimonialController.deleteBalancoPatrimonial);

/*--------------------------- (CONSORCIO) - ROTAS DE SERVIÇOS ATIVIDADES ---------------------------*/
router.post('/new-servicos-atividades',  multer(servicosAtividadesController).array('file'), servicosAtividadesController.newServicoAtividade);
router.get('/all-servicos-atividades', servicosAtividadesController.getAllServicoAtividade);
router.patch('/update-servicos-atividades/:id', multer(servicosAtividadesController).array('file'), servicosAtividadesController.updateServicoAtividade);
router.delete('/delete-servicos-atividades/:id', servicosAtividadesController.deleteServicoAtividade);

/*--------------------------- ROTAS DE MANIFESTAÇÕES ---------------------------*/
//adiciona uma nova manifestação
router.post('/new-manifestacao',  multer(ouvidoriaController).array('file'), ouvidoriaController.newManifestacao);
//obtem todas as manifestação
router.get('/all-manifestacao', ouvidoriaController.getManifestacao);
//obtem manifestacao por protocolo
router.get('/manifestacao/:protocolo', ouvidoriaController.getManifestacaoPorProtocolo);
//atualiza a manifestação
router.patch('/update-manifestacao/:id', multer(ouvidoriaController).array('file'), ouvidoriaController.updateManifestacao);
//deleta a manifestação
router.delete('/delete-manifestacao/:id', ouvidoriaController.deleteManifestacao);

/*--------------------------- ROTAS DE RESPOSTAS DE MANIFESTAÇÕES ---------------------------*/
//adiciona uma nova resposta de manifestação
router.post('/new-resposta-manifestacao', respostasManifestacaoController.newRespostaManifestacao);
//obtem todas as respostas de manifestação
router.get('/all-resposta-manifestacao', respostasManifestacaoController.getAllRespostasManifestacao);
//atualiza a resposta da manifestação
router.patch('/update-resposta-manifestacao/:id', respostasManifestacaoController.updateRespostaManifestacao);
//deleta a resposta da manifestação
router.delete('/delete-resposta-manifestacao/:id', respostasManifestacaoController.deleteRespostaManifestacao);

/*--------------------------- (CONSORCIO) - ROTAS DE FOLHA DE PAGAMENTO ---------------------------*/
router.post('/new-folha-pagamento',  multer(folhaPagamentoController).array('file'), folhaPagamentoController.newFolhaPagamento);
router.get('/all-folha-pagamento', folhaPagamentoController.getAllFolhaPagamento);
router.patch('/update-folha-pagamento/:id', multer(folhaPagamentoController).array('file'), folhaPagamentoController.updateFolhaPagamento);
router.delete('/delete-folha-pagamento/:id', folhaPagamentoController.deleteFolhaPagamento);

/*--------------------------- (CONSORCIO) - ROTAS DE CONTRATOS DE PROGRAMA ---------------------------*/
//adiciona uma novo Contrato
router.post('/new-contrato-programa',  multer(contratosProgramaController).array('file'), contratosProgramaController.newContratoPrograma);
//obtem todas os Contratos
router.get('/all-contratos-programa', contratosProgramaController.getAllContratosPrograma);
//obtem todas os Contratos conforme busca
router.get('/search-contratos-programa', contratosProgramaController.getSearchContratosPrograma);
//atualiza o Contrato
router.patch('/update-contrato-programa/:id', multer(contratosProgramaController).array('file'), contratosProgramaController.updateContratoPrograma);
//deleta o Contrato
router.delete('/delete-contrato-programa/:id', contratosProgramaController.deleteContratoPrograma);


/*--------------------------- (CONSORCIO) - ROTAS DE PESQUISA ---------------------------*/
router.get('/pesquisa',  pesquisaController.getPesquisa);

/*--------------------------- (CONSORCIO) - ROTAS DE VAGAS ---------------------------*/

router.post('/new-vaga', vagasController.newVaga);
router.get('/all-vagas', vagasController.getVagas);
router.get('/search-vagas', vagasController.getSearchVagas)
router.patch('/update-vaga/:id', vagasController.updateVaga);
router.delete('/delete-vaga/:id', vagasController.deleteVaga);

/*--------------------------- (CONSORCIO) - ROTAS DE RESULTADOS ---------------------------*/

router.post('/new-resultado', resultadosController.newResultado);
router.get('/all-resultados', resultadosController.getResultados);
router.patch('/update-resultado/:id', resultadosController.updateResultado);
router.delete('/delete-resultado/:id', resultadosController.deleteResultado);

/*--------------------------- (CONSORCIO) - ROTAS DE MUNICIPIOS  ---------------------------*/

router.post('/new-funcao', multer(funcoesController).array('file'), funcoesController.newFuncao);
router.get('/all-funcoes/:IDUnidade', funcoesController.getFuncoes);
router.patch('/update-funcao/:id', multer(funcoesController).array('file'), funcoesController.updateFuncao);
router.delete('/delete-funcao/:id', funcoesController.deleteFuncao);

module.exports = router;